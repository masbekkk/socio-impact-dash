<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateReimbursementStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'string', Rule::in(['approved', 'rejected'])],
            'notes' => ['nullable', 'string', 'max:1000'],
            'role' => ['nullable', 'string', 'in:head,finance,hr'],
            // 'transfer_proof' => [
            //     'nullable',
            //     'file',
            //     'mimes:jpg,jpeg,png,pdf',
            //     'max:5120',
            //     Rule::requiredIf($this->input('action') === 'approved'),
            // ],
        ];
    }

    public function messages(): array
    {
        return [
            'action.required' => 'Aksi (approved/rejected) wajib diisi.',
            'action.in' => 'Aksi harus berupa approved atau rejected.',
            'notes.max' => 'Catatan maksimal 1000 karakter.',
            // 'transfer_proof.required' => 'Bukti transfer wajib diupload saat menyetujui.',
            // 'transfer_proof.mimes' => 'Bukti transfer harus berupa file JPG, PNG, atau PDF.',
            // 'transfer_proof.max' => 'Ukuran file bukti transfer maksimal 5MB.',
        ];
    }
}
