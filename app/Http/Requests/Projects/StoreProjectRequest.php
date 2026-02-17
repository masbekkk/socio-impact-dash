<?php

namespace App\Http\Requests\Projects;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'client' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'division_id' => ['required', 'exists:divisions,id'],
            'account_manager_id' => ['required', 'exists:users,id'],
            'head_id' => ['required', 'exists:users,id'],
            'pic_id' => ['required', 'exists:users,id'],
            'status' => ['required', 'string'], // Will be validated against Enum in Action if needed, or use Rule::enum
            'project_type' => ['required', 'string'],
            'budget_total' => ['required', 'numeric', 'min:0'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'sow' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            
            // Nested arrays
            'locations' => ['nullable', 'array'],
            'locations.*.latitude' => ['required_with:locations', 'numeric'],
            'locations.*.longitude' => ['required_with:locations', 'numeric'],
            'locations.*.detail_address' => ['required_with:locations', 'string'],
            
            'budgets' => ['nullable', 'array'],
            'budgets.*.item_name' => ['required_with:budgets', 'string'],
            'budgets.*.quantity' => ['required_with:budgets', 'numeric', 'min:1'],
            'budgets.*.unit_price' => ['required_with:budgets', 'numeric', 'min:0'],
            'budgets.*.category_id' => ['nullable', 'exists:project_category_budgets,id'],
            
            'documents' => ['nullable', 'array'],
            'documents.*.file' => ['required_with:documents', 'file', 'max:10240'],
            'documents.*.type' => ['required_with:documents', 'string'],
            
            'milestones' => ['nullable', 'array'],
            'milestones.*.title' => ['required_with:milestones', 'string'],
            'milestones.*.target_date' => ['required_with:milestones', 'date'],
            'milestones.*.status' => ['nullable', 'string'],
        ];
    }
}
