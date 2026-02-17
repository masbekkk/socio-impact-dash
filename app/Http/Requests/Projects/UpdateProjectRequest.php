<?php

declare(strict_types=1);

namespace App\Http\Requests\Projects;

use App\Enums\DocumentType;
use App\Enums\IssueSeverity;
use App\Enums\IssueStatus;
use App\Enums\MilestoneStatus;
use App\Enums\ProjectStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Project fields - use 'sometimes' for partial updates
            'name' => ['sometimes', 'string', 'max:255'],
            'client' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'division_id' => ['sometimes', 'integer', 'exists:divisions,id'],
            'account_manager_id' => ['sometimes', 'integer', 'exists:users,id'],
            'head_id' => ['sometimes', 'integer', 'exists:users,id'],
            'pic_id' => ['sometimes', 'integer', 'exists:users,id'],
            'status' => ['sometimes', 'string', Rule::enum(ProjectStatus::class)],
            'project_type' => ['sometimes', 'string', 'max:255'],
            'sow' => ['sometimes', 'file', 'max:10240'], // SOW document file, max 10MB
            'budget_total' => ['sometimes', 'numeric', 'min:0'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date', 'after_or_equal:start_date'],

            // Locations - all fields 'sometimes' for partial updates
            'locations' => ['nullable', 'array'],
            'locations.*.id' => ['nullable', 'integer', 'exists:project_locations,id'],
            'locations.*.latitude' => ['sometimes', 'string', 'max:255'],
            'locations.*.longitude' => ['sometimes', 'string', 'max:255'],
            'locations.*.detail_address' => ['sometimes', 'string', 'max:255'],

            // Documents - partial update support
            'documents' => ['nullable', 'array'],
            'documents.*.id' => ['nullable', 'integer', 'exists:project_documents,id'],
            'documents.*.file' => ['sometimes', 'file', 'max:10240'],
            'documents.*.type' => ['sometimes', 'string', Rule::enum(DocumentType::class)],

            // Termin Payments
            'termin_payments' => ['nullable', 'array'],
            'termin_payments.*.id' => ['nullable', 'integer', 'exists:project_termin_payments,id'],
            'termin_payments.*.nominal' => ['sometimes', 'numeric', 'min:0'],
            'termin_payments.*.due_date' => ['sometimes', 'date'],
            'termin_payments.*.notes' => ['nullable', 'string'],

            // IDs to delete
            'delete_locations' => ['nullable', 'array'],
            'delete_locations.*' => ['integer', 'exists:project_locations,id'],
            'delete_documents' => ['nullable', 'array'],
            'delete_documents.*' => ['integer', 'exists:project_documents,id'],
            'delete_termin_payments' => ['nullable', 'array'],
            'delete_termin_payments.*' => ['integer', 'exists:project_termin_payments,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.string' => 'Nama project harus berupa teks.',
            'client.string' => 'Nama client harus berupa teks.',
            'project_type.string' => 'Tipe project harus berupa teks.',
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
            'documents.*.file.file' => 'Dokumen harus berupa file.',
            'documents.*.file.max' => 'Ukuran dokumen maksimal 10MB.',

            // Termin Payments
            'termin_payments.array' => 'Termin pembayaran harus berupa array.',
        ];
    }
}
