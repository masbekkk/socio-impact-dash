<?php

declare(strict_types=1);

namespace App\Http\Requests\Projects;

use App\Enums\ProjectStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreProjectRequest extends FormRequest
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
            'code' => ['nullable', 'string', 'max:50', Rule::unique('projects', 'code')],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'division_id' => ['required', 'exists:divisions,id'],
            'account_manager_id' => ['required', 'exists:users,id'],
            'head_id' => ['required', 'exists:users,id'],
            'pic_id' => ['required', 'exists:users,id'],
            'project_type' => ['required', 'string'],
            'status' => ['nullable', Rule::enum(ProjectStatus::class)],
            'budget_total' => ['required', 'numeric', 'min:0'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'lesson_learned' => ['nullable', 'string'],
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
            'documents.*.file' => ['required', 'file', 'max:10240'], // 10MB limit
            'detail_budgets' => ['nullable', 'array'],
            'detail_budgets.*.quantity' => ['required_with:detail_budgets', 'numeric', 'min:1'],
            'detail_budgets.*.item_price' => ['required_with:detail_budgets', 'numeric', 'min:0'],
            'detail_budgets.*.amount' => ['required', 'numeric', 'min:0'],
            'detail_budgets.*.notes' => ['nullable', 'string'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $budgetTotal = (float) $this->input('budget_total', 0);
            $detailBudgets = $this->input('detail_budgets', []);

            if (is_array($detailBudgets) && count($detailBudgets) > 0) {
                // Ensure array_sum works on amount even if it is a string or not set
                $detailSum = array_reduce($detailBudgets, function ($carry, $item) {
                    $amount = isset($item['amount']) ? (float) $item['amount'] :
                              ((isset($item['quantity']) && isset($item['item_price'])) ? (int) $item['quantity'] * (float) $item['item_price'] : 0);

                    return $carry + $amount;
                }, 0);

                if ($detailSum > ($budgetTotal + 0.01)) {
                    $validator->errors()->add('detail_budgets', 'Total rincian anggaran tidak boleh melebihi total anggaran proyek.');
                }
            }
        });
    }
}
