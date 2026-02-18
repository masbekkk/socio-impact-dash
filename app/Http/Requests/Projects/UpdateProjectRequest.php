<?php

namespace App\Http\Requests\Projects;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'client' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'division_id' => ['sometimes', 'exists:divisions,id'],
            'account_manager_id' => ['sometimes', 'exists:users,id'],
            'head_id' => ['sometimes', 'exists:users,id'],
            'pic_id' => ['sometimes', 'exists:users,id'],
            'status' => ['sometimes', 'string'],
            'project_type' => ['sometimes', 'string'],
            'budget_total' => ['sometimes', 'numeric', 'min:0'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date', 'after_or_equal:start_date'],
            'sow' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            
            // Nested arrays (allowing full sync or partial)
            'locations' => ['nullable', 'array'],
            'budgets' => ['nullable', 'array'],
            'documents' => ['nullable', 'array'],
            'milestones' => ['nullable', 'array'],
        ];
    }
}
