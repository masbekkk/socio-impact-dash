<?php

declare(strict_types=1);

namespace App\Http\Requests\Projects;

use App\Enums\DocumentType;
use App\Enums\ProjectStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Project fields (code is auto-generated)
            'name' => ['required', 'string', 'max:255'],
            'client' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'division_id' => ['nullable', 'integer', 'exists:divisions,id'],
            'account_manager_id' => ['nullable', 'integer', 'exists:users,id'],
            'head_id' => ['nullable', 'integer', 'exists:users,id'],
            'pic_id' => ['nullable', 'integer', 'exists:users,id'],
            'status' => ['nullable', 'string', Rule::enum(ProjectStatus::class)],
            'project_type' => ['required', 'string', 'max:255'],
            'sow' => ['nullable', 'file', 'max:10240'], // SOW document file, max 10MB
            'budget_total' => ['nullable', 'numeric', 'min:0'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],

            // Locations
            'locations' => ['nullable', 'array'],
            'locations.*.latitude' => ['nullable', 'string', 'max:255'],
            'locations.*.longitude' => ['nullable', 'string', 'max:255'],
            'locations.*.detail_address' => ['nullable', 'string', 'max:255'],

            // Documents
            'documents' => ['nullable', 'array'],
            'documents.*.file' => ['required', 'file', 'max:10240'],
            'documents.*.type' => ['nullable', 'string', Rule::enum(DocumentType::class)],

            // Termin Payments
            'termin_payments' => ['nullable', 'array'],
            'termin_payments.*.nominal' => ['required', 'numeric', 'min:0'],
            'termin_payments.*.due_date' => ['required', 'date'],
            'termin_payments.*.notes' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama project wajib diisi.',
            'client.required' => 'Nama client wajib diisi.',
            'project_type.required' => 'Tipe project wajib diisi.',
            'division_id.exists' => 'Divisi tidak ditemukan.',
            'account_manager_id.exists' => 'Account Manager tidak ditemukan.',
            'head_id.exists' => 'Head tidak ditemukan.',
            'pic_id.exists' => 'PIC tidak ditemukan.',
            'budget_total.numeric' => 'Total budget harus berupa angka.',
            'budget_total.min' => 'Total budget tidak boleh kurang dari 0.',
            
            // Locations
            'locations.array' => 'Lokasi harus berupa array.',
            
            // Documents
            'documents.array' => 'Dokumen harus berupa array.',
            'documents.*.file.required' => 'File dokumen wajib diisi.',
            'documents.*.file.file' => 'Dokumen harus berupa file.',
            'documents.*.file.max' => 'Ukuran dokumen maksimal 10MB.',

            // Termin Payments
            'termin_payments.array' => 'Termin pembayaran harus berupa array.',
            'termin_payments.*.nominal.required' => 'Nominal termin wajib diisi.',
            'termin_payments.*.due_date.required' => 'Tanggal jatuh tempo termin wajib diisi.',
        ];
    }
}
