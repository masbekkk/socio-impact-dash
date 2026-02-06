<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\PresenceStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class SubmitPermissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => ['required', 'date', 'after_or_equal:today'],
            'status' => ['required', 'string', new Enum(PresenceStatus::class)],
            'attachment' => ['nullable', 'file', 'max:10240'], // Max 10MB
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'date.required' => 'Tanggal wajib diisi.',
            'date.after_or_equal' => 'Tanggal harus hari ini atau setelahnya.',
            'status.required' => 'Status wajib diisi.',
            'attachment.max' => 'Ukuran lampiran maksimal 10MB.',
        ];
    }
}
