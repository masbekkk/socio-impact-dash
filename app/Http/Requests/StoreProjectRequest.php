<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\DocumentType;
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
            'sow' => ['nullable', 'string'],
            'budget_total' => ['nullable', 'numeric', 'min:0'],

            // Locations (array of locations)
            'locations' => ['nullable', 'array'],
            'locations.*.latitude' => ['nullable', 'string', 'max:255'],
            'locations.*.longitude' => ['nullable', 'string', 'max:255'],
            'locations.*.detail_address' => ['nullable', 'string', 'max:255'],

            // Documents (array of uploaded files with metadata)
            'documents' => ['nullable', 'array'],
            'documents.*.file' => ['required', 'file', 'max:10240'], // Max 10MB
            'documents.*.type' => ['nullable', 'string', Rule::enum(DocumentType::class)],

            // Budgets (array of budget items)
            'budgets' => ['nullable', 'array'],
            'budgets.*.category' => ['required', 'string', 'max:255'],
            'budgets.*.planned_amount' => ['required', 'numeric', 'min:0'],
            'budgets.*.actual_amount' => ['nullable', 'numeric', 'min:0'],

            // Milestones (array of milestone items)
            'milestones' => ['nullable', 'array'],
            'milestones.*.title' => ['required', 'string', 'max:255'],
            'milestones.*.description' => ['nullable', 'string'],
            'milestones.*.target_date' => ['required', 'date'],
            'milestones.*.actual_date' => ['nullable', 'date'],
            'milestones.*.status' => ['nullable', 'string'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'code.required' => 'Kode project wajib diisi.',
            'code.unique' => 'Kode project sudah digunakan.',
            'name.required' => 'Nama project wajib diisi.',
            'client.required' => 'Nama client wajib diisi.',
            'project_type.required' => 'Tipe project wajib diisi.',
            'division_id.exists' => 'Divisi tidak ditemukan.',
            'account_manager_id.exists' => 'Account Manager tidak ditemukan.',
            'head_id.exists' => 'Head tidak ditemukan.',
            'pic_id.exists' => 'PIC tidak ditemukan.',
            'budget_total.numeric' => 'Total budget harus berupa angka.',
            'budget_total.min' => 'Total budget tidak boleh kurang dari 0.',
            'status.Illuminate\Validation\Rules\Enum' => 'Status project tidak valid.',
            
            // Locations
            'locations.array' => 'Lokasi harus berupa array.',
            
            // Documents
            'documents.array' => 'Dokumen harus berupa array.',
            'documents.*.file.required' => 'File dokumen wajib diisi.',
            'documents.*.file.file' => 'Dokumen harus berupa file.',
            'documents.*.file.max' => 'Ukuran dokumen maksimal 10MB.',
            
            // Budgets
            'budgets.array' => 'Budget harus berupa array.',
            'budgets.*.category.required' => 'Kategori budget wajib diisi.',
            'budgets.*.planned_amount.required' => 'Jumlah budget yang direncanakan wajib diisi.',
            'budgets.*.planned_amount.numeric' => 'Jumlah budget harus berupa angka.',
            'budgets.*.planned_amount.min' => 'Jumlah budget tidak boleh kurang dari 0.',

            // Milestones
            'milestones.array' => 'Milestone harus berupa array.',
            'milestones.*.title.required' => 'Judul milestone wajib diisi.',
            'milestones.*.target_date.required' => 'Target tanggal wajib diisi.',
            'milestones.*.target_date.date' => 'Target tanggal harus berupa tanggal yang valid.',
        ];
    }
}
