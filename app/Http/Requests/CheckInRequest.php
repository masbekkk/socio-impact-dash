<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class CheckInRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'photo' => ['nullable', 'image', 'max:5120'], // Max 5MB
            'attachment' => ['nullable', 'file', 'max:10240'], // Max 10MB
            'status' => ['nullable', 'string'], // For WFH, Field Duty, etc.
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'latitude.between' => 'Latitude harus antara -90 dan 90.',
            'longitude.between' => 'Longitude harus antara -180 dan 180.',
            'photo.image' => 'File harus berupa gambar.',
            'photo.max' => 'Ukuran foto maksimal 5MB.',
            'attachment.max' => 'Ukuran lampiran maksimal 10MB.',
        ];
    }
}
