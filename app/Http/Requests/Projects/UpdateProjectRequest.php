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
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'division_id' => ['sometimes', 'required', 'exists:divisions,id'],
            'account_manager_id' => ['sometimes', 'required', 'exists:users,id'],
            'head_id' => ['sometimes', 'required', 'exists:users,id'],
            'pic_id' => ['sometimes', 'required', 'exists:users,id'],
            'project_type' => ['sometimes', 'required', 'string'],
            'status' => ['sometimes', 'required', Rule::enum(ProjectStatus::class)],
            'budget_total' => ['sometimes', 'required', 'numeric', 'min:0'],
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
}
