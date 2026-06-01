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
            'client_name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'division_id' => ['required', 'exists:divisions,id'],
            'account_manager_id' => ['required', 'exists:users,id'],
            'head_id' => ['required', 'exists:users,id'],
            'pic_id' => [
                'required',
                'exists:users,id',
                function ($attribute, $value, $fail): void {
                    $user = \App\Models\User::query()->find($value);
                    if ($user && $user->hasRole(\App\Enums\UserRole::Direktur->value)) {
                        $fail('The selected PIC cannot be a Direktur.');
                    }
                },
            ],
            'project_type' => ['required', 'string'],
            'status' => ['nullable', Rule::enum(ProjectStatus::class)],
            'budget_total' => ['required', 'numeric', 'min:0'],
            'operational_budget' => ['nullable', 'numeric', 'min:0'],
            'management_budget' => ['nullable', 'numeric', 'min:0'],
            'allowance_budget' => ['nullable', 'numeric', 'min:0'],
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
            'documents.*.file' => ['required', 'file', 'max:51200', 'mimes:pdf,jpg,jpeg,png'], // 50MB limit
            'detail_budgets' => ['nullable', 'array'],
            'detail_budgets.*.item_name' => ['required_with:detail_budgets', 'string', 'max:255'],
            'detail_budgets.*.quantity' => ['nullable', 'numeric', 'min:1'],
            'detail_budgets.*.item_price' => ['required_with:detail_budgets', 'numeric', 'min:0'],
            'detail_budgets.*.amount' => ['required', 'numeric', 'min:0'],
            'detail_budgets.*.amount_pelaksanaan' => ['nullable', 'numeric', 'min:0'],
            'detail_budgets.*.amount_proposal' => ['nullable', 'numeric', 'min:0'],
            'detail_budgets.*.notes' => ['nullable', 'string'],
        ];
    }

    public function withValidator(\Illuminate\Validation\Validator $validator): void
    {
        $validator->after(function (\Illuminate\Validation\Validator $validator): void {
            $budgetTotal = (float) $this->input('budget_total', 0);
            $detailBudgets = $this->input('detail_budgets', []);

            if (is_array($detailBudgets) && count($detailBudgets) > 0) {
                // Ensure array_sum works on amount even if it is a string or not set
                $detailSum = array_reduce($detailBudgets, function (float $carry, array $item): float {
                    $amount = isset($item['amount']) ? (float) $item['amount'] :
                              ((isset($item['quantity']) && isset($item['item_price'])) ? (int) $item['quantity'] * (float) $item['item_price'] : 0);

                    return $carry + $amount;
                }, 0);

                if ($detailSum > ($budgetTotal + 0.01)) {
                    $validator->errors()->add('detail_budgets', 'Total rincian anggaran tidak boleh melebihi total anggaran proyek.');
                }
            }

            $terminPayments = $this->input('termin_payments', []);
            if (is_array($terminPayments) && count($terminPayments) > 0) {
                $terminSum = array_reduce($terminPayments, fn (float $carry, array $item): float => $carry + (float) $item['nominal'], 0);
                if ($terminSum > ($budgetTotal + 0.01)) {
                    $validator->errors()->add('termin_payments', 'Total termin pembayaran tidak boleh melebihi total anggaran proyek.');
                }

                // Check chronological order
                $prevDate = null;
                foreach ($terminPayments as $index => $termin) {
                    $currentDate = \Illuminate\Support\Facades\Date::parse($termin['due_date']);
                    if ($prevDate && $currentDate->lessThan($prevDate)) {
                        $validator->errors()->add("termin_payments.{$index}.due_date", 'Tanggal jatuh tempo termin harus berurutan.');
                    }
                    $prevDate = $currentDate;
                }
            }
        });
    }

    public function attributes(): array
    {
        return [
            'termin_payments.*.nominal' => 'Nominal Termin',
            'termin_payments.*.due_date' => 'Tanggal Jatuh Tempo',
            'termin_payments.*.notes' => 'Deliverables',
            'documents.*.type' => 'Nama Dokumen',
            'documents.*.file' => 'File Dokumen',
            'detail_budgets.*.item_name' => 'Nama Kegiatan',
            'detail_budgets.*.amount_proposal' => 'Nominal Proposal',
            'detail_budgets.*.amount_pelaksanaan' => 'Nominal Pelaksanaan',
        ];
    }
}
