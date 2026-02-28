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
            'project_id' => ['nullable', 'integer', 'exists:projects,id'],
            'atr_id' => ['nullable', 'integer', 'exists:reimbursements,id'],
            'type' => ['required', 'string', new Enum(ReimbursementType::class)],
            'eer_type' => ['nullable', 'string', 'in:refund,reimburse'],
            'amount' => ['nullable', 'numeric'],
            'approver_head_id' => ['nullable', 'integer', 'exists:users,id'],
            'approver_finance_id' => ['nullable', 'integer', 'exists:users,id'],
            'approver_direktur_id' => ['nullable', 'integer', 'exists:users,id'],
            'approver_hr_id' => ['nullable', 'integer', 'exists:users,id'],
            'bank_name' => ['nullable', 'string', 'max:100'],
            'bank_account' => ['nullable', 'string', 'max:50'],
            'account_holder' => ['nullable', 'string', 'max:100'],
            'usage_plan' => ['nullable', 'string'],
            'urgency' => ['nullable', 'string', 'max:20'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'replacement_pic_id' => ['nullable', 'integer', 'exists:users,id'],
            'documents' => ['nullable', 'array'],
            'documents.*.file' => ['required', 'file', 'max:10240'],
            'documents.*.type' => ['nullable', 'string'],

            'selected_budget_details' => ['nullable', 'array'],
            'selected_budget_details.*.project_budget_detail_id' => ['required', 'integer', 'exists:project_budget_details,id'],
            'selected_budget_details.*.amount' => ['required', 'numeric', 'min:0'],
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
