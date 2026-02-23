<?php

declare(strict_types=1);

namespace App\Http\Requests\Projects;

use App\Enums\ProjectStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'code' => ['sometimes', 'required', 'string', 'max:50', Rule::unique('projects', 'code')->ignore($this->route('project'))],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'division_id' => ['sometimes', 'required', 'exists:divisions,id'],
            'account_manager_id' => ['sometimes', 'required', 'exists:users,id'],
            'head_id' => ['sometimes', 'required', 'exists:users,id'],
            'pic_id' => ['sometimes', 'required', 'exists:users,id'],
            'project_type' => ['sometimes', 'required', 'string'],
            'status' => ['sometimes', 'required', Rule::enum(ProjectStatus::class)],
            'budget_total' => ['sometimes', 'required', 'numeric', 'min:0'],
            'operational_budget' => ['sometimes', 'numeric', 'min:0'],
            'allowance_budget' => ['sometimes', 'numeric', 'min:0'],
            'budget_partition_status' => ['sometimes', 'string', 'in:draft,pending,approved,rejected'],
            'start_date' => ['sometimes', 'required', 'date'],
            'end_date' => ['sometimes', 'required', 'date', 'after_or_equal:start_date'],
            'locations' => ['nullable', 'array'],
            'locations.*.latitude' => ['required', 'numeric'],
            'locations.*.longitude' => ['required', 'numeric'],
            'locations.*.detail_address' => ['required', 'string'],
            'termin_payments' => ['nullable', 'array'],
            'termin_payments.*.nominal' => ['required', 'numeric', 'min:0'],
            'termin_payments.*.due_date' => ['required', 'date'],
            'termin_payments.*.notes' => ['nullable', 'string'],
            'documents' => ['nullable', 'array'],
            'documents.*.type' => ['required', 'string'],
            'documents.*.file' => ['required', 'file', 'max:10240'],
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $user = $this->user();

            if ($this->has('operational_budget') || $this->has('allowance_budget')) {
                if (! $user->can('input_budget_partition')) {
                    $validator->errors()->add('operational_budget', 'You do not have permission to modify budget partitions.');
                }
            }

            if ($this->has('budget_partition_status')) {
                $status = $this->input('budget_partition_status');
                if (in_array($status, ['approved', 'rejected']) && ! $user->can('approval_budget_partition')) {
                    $validator->errors()->add('budget_partition_status', 'You do not have permission to approve/reject budget partitions.');
                }
            }

            // Budget Sum Validation
            if ($this->hasAny(['operational_budget', 'allowance_budget', 'budget_total'])) {
                $project = $this->route('project');
                $total = (float) ($this->input('budget_total') ?? $project->budget_total);
                $ops = (float) ($this->input('operational_budget') ?? $project->operational_budget);
                $allowance = (float) ($this->input('allowance_budget') ?? $project->allowance_budget);
                $management = $total * 0.3;

                if (($ops + $allowance + $management) > ($total + 0.01)) {
                    $validator->errors()->add('operational_budget', 'Total operational, allowance, and management (30%) budget cannot exceed the total project budget.');
                }
            }
        });
    }
}
