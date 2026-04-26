<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\ReimbursementType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

final class StoreReimbursementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['nullable', 'string', 'max:50', 'unique:reimbursements,code'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'project_id' => ['nullable', 'integer', 'exists:projects,id'],
            'atr_id' => ['nullable', 'integer', 'exists:reimbursements,id'],
            'type' => ['required', 'string', new Enum(ReimbursementType::class)],
            'status' => ['nullable', 'string', new Enum(\App\Enums\ReimbursementStatus::class)],
            'eer_type' => ['nullable', 'string', 'in:refund,reimbursement,balance'],
            'amount' => ['nullable', 'numeric'],
            'approver_head_id' => ['required', 'integer', 'exists:users,id'],
            'approver_finance_id' => ['nullable', 'integer', 'exists:users,id'],
            'approver_direktur_id' => ['nullable', 'integer', 'exists:users,id'],
            'approver_hr_id' => ['nullable', 'integer', 'exists:users,id'],
            'bank_name' => ['nullable', 'string', 'max:100'],
            'bank_account' => ['nullable', 'string', 'max:50'],
            'account_holder' => ['nullable', 'string', 'max:100'],
            'bank_branch' => ['nullable', 'string', 'max:100'],
            'usage_plan' => ['nullable', 'string'],
            'urgency' => ['nullable', 'string', 'max:20'],
            'start_date' => ['nullable', 'date'],
            'start_time' => ['nullable', 'string', 'max:10'],
            'end_date' => [
                'required_if:type,allowance',
                'nullable',
                'date',
                'after_or_equal:start_date',
            ],
            'end_time' => ['nullable', 'string', 'max:10'],
            'documents' => ['nullable', 'array'],
            'documents.*.file' => ['required_unless:status,draft', 'file', 'max:10240'],
            'documents.*.type' => ['nullable', 'string'],

            'selected_budget_details' => ['nullable', 'array'],
            'selected_budget_details.*.project_budget_detail_id' => ['required', 'integer', 'exists:project_budget_details,id'],
            'selected_budget_details.*.amount' => ['required', 'numeric', 'min:0'],
            'selected_budget_details.*.notes' => ['nullable', 'string'],

            'items' => ['nullable', 'array'],
            'items.*.project_budget_detail_id' => ['required', 'integer', 'exists:project_budget_details,id'],
            'items.*.parent_item_id' => ['nullable', 'integer', 'exists:reimbursement_items,id'],
            'items.*.item_name' => ['required_unless:status,draft', 'string', 'max:255'],
            'items.*.quantity' => ['required_unless:status,draft', 'integer', 'min:1'],
            'items.*.unit_price' => ['required_unless:status,draft', 'numeric', 'min:0'],
            'items.*.amount' => ['required_unless:status,draft', 'numeric', 'min:0'],
            'items.*.expense_type' => ['nullable', 'string'],
            'items.*.receipt' => ['nullable', 'file', 'max:10240'],
            'items.*.notes' => ['nullable', 'string'],
            'transfer_proof' => ['nullable', 'file', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'Jenis reimbursement wajib diisi.',
            'amount.required' => 'Jumlah nominal wajib diisi.',
            'amount.min' => 'Jumlah nominal minimal 1.',
            'documents.*.file.required' => 'File dokumen wajib diisi.',
            'documents.*.file.max' => 'Ukuran file dokumen maksimal 10MB.',
            'project_id.exists' => 'Project tidak ditemukan.',
        ];
    }
}
