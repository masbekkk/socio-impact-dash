<?php

declare(strict_types=1);

namespace App\Http\Requests;

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

            // Locations
            'locations' => ['nullable', 'array'],
            'locations.*.latitude' => ['nullable', 'string', 'max:255'],
            'locations.*.longitude' => ['nullable', 'string', 'max:255'],
            'locations.*.detail_address' => ['nullable', 'string', 'max:255'],

            // Documents
            'documents' => ['nullable', 'array'],
            'documents.*.file' => ['required', 'file', 'max:10240'],
            'documents.*.type' => ['nullable', 'string', Rule::enum(DocumentType::class)],

            // Categories - MUST be created first before budgets
            'categories' => ['nullable', 'array'],
            'categories.*.name' => ['required', 'string', 'max:255'],
            // 'categories.*.total_amount' => ['nullable', 'numeric', 'min:0'], // diitung diservice
            'categories.*.status' => ['nullable', 'string'],

            // Budgets - references category by index (category_index) or existing ID (category_id)
            'budgets' => ['nullable', 'array'],
            'budgets.*.item_name' => ['required', 'string', 'max:255'],
            'budgets.*.quantity' => ['required', 'integer', 'min:1'],
            'budgets.*.unit_price' => ['required', 'numeric', 'min:0'],
            // 'budgets.*.planned_amount' => ['nullable', 'numeric', 'min:0'], // diitung di service
            // 'budgets.*.actual_amount' => ['nullable', 'numeric', 'min:0'], // ini kosong
            'budgets.*.status' => ['nullable', 'string'],
            // Use category_index to reference new category from categories array (0-based index)
            'budgets.*.category_index' => ['nullable', 'integer', 'min:0'],
            // Or use category_id to reference existing category
            'budgets.*.category_id' => ['nullable', 'integer', 'exists:project_category_budgets,id'],

            // Milestones
            'milestones' => ['nullable', 'array'],
            'milestones.*.title' => ['required', 'string', 'max:255'],
            'milestones.*.description' => ['nullable', 'string'],
            'milestones.*.target_date' => ['required', 'date'],
            'milestones.*.actual_date' => ['nullable', 'date'],
            'milestones.*.status' => ['nullable', 'string'],
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

            // Categories
            'categories.array' => 'Kategori harus berupa array.',
            'categories.*.name.required' => 'Nama kategori wajib diisi.',
            
            // Budgets
            'budgets.array' => 'Budget harus berupa array.',
            'budgets.*.item_name.required' => 'Nama item budget wajib diisi.',
            'budgets.*.quantity.required' => 'Jumlah item wajib diisi.',
            'budgets.*.quantity.integer' => 'Jumlah item harus berupa angka bulat.',
            'budgets.*.quantity.min' => 'Jumlah item minimal 1.',
            'budgets.*.unit_price.required' => 'Harga satuan wajib diisi.',
            'budgets.*.unit_price.numeric' => 'Harga satuan harus berupa angka.',
            // 'budgets.*.planned_amount.required' => 'Jumlah budget yang direncanakan wajib diisi.',
            // 'budgets.*.planned_amount.numeric' => 'Jumlah budget harus berupa angka.',
            'budgets.*.category_id.exists' => 'Kategori budget tidak ditemukan.',
            // 'budgets.*.category_index.integer' => 'Index kategori harus berupa angka.',

            // Milestones
            'milestones.array' => 'Milestone harus berupa array.',
            'milestones.*.title.required' => 'Judul milestone wajib diisi.',
            'milestones.*.target_date.required' => 'Target tanggal wajib diisi.',
            'milestones.*.target_date.date' => 'Target tanggal harus berupa tanggal yang valid.',
        ];
    }
}
