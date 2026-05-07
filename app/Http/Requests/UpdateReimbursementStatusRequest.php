<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\ReimbursementStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

final class UpdateReimbursementStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'string', new Enum(ReimbursementStatus::class)],
            'notes' => ['nullable', 'string', 'max:1000'],
            'role' => ['nullable', 'string', 'in:head,finance,hr,direktur'],
            'transfer_proof' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,pdf',
                'max:5120',
                Rule::requiredIf(function () {
                    if ($this->input('action') !== 'transferred') {
                        return false;
                    }
                    
                    $reimbursement = $this->route('reimbursement');
                    if (is_string($reimbursement) || is_numeric($reimbursement)) {
                        $reimbursement = \App\Models\Reimbursement::find($reimbursement);
                    }
                    
                    if ($reimbursement && $reimbursement->type === \App\Enums\ReimbursementType::ALLOWANCE) {
                        return false;
                    }
                    
                    return true;
                }),
            ],
            'amount' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'action.required' => 'Aksi wajib diisi.',
            'action.in' => 'Aksi harus berupa approved, rejected, revision, atau transferred.',
            'notes.max' => 'Catatan maksimal 1000 karakter.',
            'transfer_proof.required' => 'Bukti transfer wajib diupload saat menyelesaikan transfer.',
            'transfer_proof.mimes' => 'Bukti transfer harus berupa file JPG, PNG, atau PDF.',
            'transfer_proof.max' => 'Ukuran file bukti transfer maksimal 5MB.',
        ];
    }
}
