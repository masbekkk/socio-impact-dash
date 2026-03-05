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
            'code' => ['nullable', 'string', 'max:50', Rule::unique('projects', 'code')->ignore($this->route('project'))],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'division_id' => ['sometimes', 'required', 'exists:divisions,id'],
            'account_manager_id' => ['sometimes', 'required', 'exists:users,id'],
            'head_id' => ['sometimes', 'required', 'exists:users,id'],
            'pic_id' => [
                'sometimes',
                'required',
                'exists:users,id',
                function ($attribute, $value, $fail) {
                    $user = \App\Models\User::find($value);
                    if ($user && $user->hasRole(\App\Enums\UserRole::Direktur->value)) {
                        $fail('The selected PIC cannot be a Direktur.');
                    }
                },
            ],
            'project_type' => ['sometimes', 'required', 'string'],
            'status' => ['sometimes', 'required', Rule::enum(ProjectStatus::class)],
            'budget_total' => ['sometimes', 'required', 'numeric', 'min:0'],
            'operational_budget' => ['sometimes', 'numeric', 'min:0'],
            'allowance_budget' => ['sometimes', 'numeric', 'min:0'],
            'budget_partition_status' => ['sometimes', 'string', 'in:draft,pending,approved,rejected'],
            'start_date' => ['sometimes', 'required', 'date'],
            'end_date' => ['sometimes', 'required', 'date', 'after_or_equal:start_date'],
            'lesson_learned' => ['nullable'],
            'locations' => ['nullable', 'array'],
            'locations.*.id' => ['nullable', 'integer'],
            'locations.*.latitude' => ['required', 'numeric'],
            'locations.*.longitude' => ['required', 'numeric'],
            'locations.*.detail_address' => ['required', 'string'],
            'termin_payments' => ['nullable', 'array'],
            'termin_payments.*.id' => ['nullable', 'integer'],
            'termin_payments.*.nominal' => ['required', 'numeric', 'min:0'],
            'termin_payments.*.due_date' => ['required', 'date'],
            'termin_payments.*.notes' => ['nullable', 'string'],
            'documents.*.id' => ['nullable', 'integer'],
            'documents.*.type' => ['required', 'string'],
            'documents.*.file' => ['sometimes', 'file', 'max:51200'], // 50MB limit
            'detail_budgets' => ['nullable', 'array'],
            'detail_budgets.*.id' => ['nullable', 'integer'],
            'detail_budgets.*.item_name' => ['required_with:detail_budgets', 'string', 'max:255'],
            'detail_budgets.*.quantity' => ['nullable', 'numeric', 'min:1'],
            'detail_budgets.*.item_price' => ['required_with:detail_budgets', 'numeric', 'min:0'],
            'detail_budgets.*.amount' => ['required', 'numeric', 'min:0'],
            'detail_budgets.*.amount_pelaksanaan' => ['nullable', 'numeric', 'min:0'],
            'detail_budgets.*.amount_proposal' => ['nullable', 'numeric', 'min:0'],
            'detail_budgets.*.notes' => ['nullable', 'string'],
            'delete_locations' => ['nullable', 'array'],
            'delete_locations.*' => ['integer'],
            'delete_termin_payments' => ['nullable', 'array'],
            'delete_termin_payments.*' => ['integer'],
            'delete_documents' => ['nullable', 'array'],
            'delete_documents.*' => ['integer'],
            'delete_detail_budgets' => ['nullable', 'array'],
            'delete_detail_budgets.*' => ['integer'],
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator(\Illuminate\Validation\Validator $validator): void
    {
        $validator->after(function (\Illuminate\Validation\Validator $validator): void {
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
            if ($this->hasAny(['operational_budget', 'management_budget', 'allowance_budget', 'budget_total'])) {
                $project = $this->route('project');
                $total = (float) ($this->input('budget_total') ?? $project->budget_total);
                $ops = (float) ($this->input('operational_budget') ?? $project->operational_budget);
                $management = (float) ($this->input('management_budget') ?? $project->management_budget);
                $allowance = (float) ($this->input('allowance_budget') ?? $project->allowance_budget);

                if (($ops + $allowance + $management) > ($total + 0.01)) {
                    $validator->errors()->add('operational_budget', 'Total operational, allowance, and management budget cannot exceed the total project budget.');
                }
            }
            // Detail Budgets Sum Validation
            $detailBudgets = $this->input('detail_budgets');
            if (is_array($detailBudgets)) {
                $project = $this->route('project');
                $budgetTotal = (float) ($this->input('budget_total') ?? $project->budget_total);
                // If the project has an actual_budget > 0, we should ideally restrict by that if we are in closing.
                // But typically UpdateProjectRequest is for general updates. We'll use actual_budget if > 0, else budget_total.
                $limit = $project->actual_budget > 0 ? (float) $project->actual_budget : $budgetTotal;

                $detailSum = array_reduce($detailBudgets, function (float $carry, array $item): float {
                    $amount = isset($item['amount']) ? (float) $item['amount'] :
                              ((isset($item['quantity']) && isset($item['item_price'])) ? (int) $item['quantity'] * (float) $item['item_price'] : 0);

                    return $carry + $amount;
                }, 0);

                if ($detailSum > ($limit + 0.01)) {
                    $validator->errors()->add('detail_budgets', 'Total rincian anggaran tidak boleh melebihi batas anggaran ('.number_format($limit, 0, ',', '.').').');
                }
            }

            // Termin Payments Validation
            $terminPayments = $this->input('termin_payments');
            if (is_array($terminPayments) && count($terminPayments) > 0) {
                $project = $this->route('project');
                $budgetTotal = (float) ($this->input('budget_total') ?? $project->budget_total);
                
                $terminSum = array_reduce($terminPayments, fn (float $carry, array $item): float => $carry + (float) $item['nominal'], 0);
                if ($terminSum > ($budgetTotal + 0.01)) {
                    $validator->errors()->add('termin_payments', 'Total termin pembayaran tidak boleh melebihi total anggaran proyek.');
                }

                // Check chronological order
                $prevDate = null;
                foreach ($terminPayments as $index => $term) {
                    $currentDate = $term['due_date'] ?? null;
                    if ($prevDate && $currentDate && strtotime($currentDate) < strtotime($prevDate)) {
                        $validator->errors()->add("termin_payments.{$index}.due_date", 'Tanggal jatuh tempo termin harus berurutan.');
                    }
                    $prevDate = $currentDate;
                }
            }
        });
    }
}
