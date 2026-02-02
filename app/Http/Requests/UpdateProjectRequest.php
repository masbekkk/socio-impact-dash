<?php

declare(strict_types=1);

namespace App\Http\Requests;

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
            // Project fields
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

            // Locations
            'locations' => ['nullable', 'array'],
            'locations.*.id' => ['nullable', 'integer', 'exists:project_locations,id'],
            'locations.*.latitude' => ['nullable', 'string', 'max:255'],
            'locations.*.longitude' => ['nullable', 'string', 'max:255'],
            'locations.*.detail_address' => ['nullable', 'string', 'max:255'],

            // Documents
            'documents' => ['nullable', 'array'],
            'documents.*.id' => ['nullable', 'integer', 'exists:project_documents,id'],
            'documents.*.file' => ['nullable', 'file', 'max:10240'],
            'documents.*.type' => ['nullable', 'string', Rule::enum(DocumentType::class)],

            // Categories - create new or update existing
            'categories' => ['nullable', 'array'],
            'categories.*.id' => ['nullable', 'integer', 'exists:project_category_budgets,id'],
            'categories.*.name' => ['required', 'string', 'max:255'],
            'categories.*.total_amount' => ['nullable', 'numeric', 'min:0'],
            'categories.*.status' => ['nullable', 'string'],

            // Budgets
            'budgets' => ['nullable', 'array'],
            'budgets.*.id' => ['nullable', 'integer', 'exists:project_budgets,id'],
            'budgets.*.item_name' => ['required', 'string', 'max:255'],
            'budgets.*.quantity' => ['required', 'integer', 'min:1'],
            'budgets.*.unit_price' => ['required', 'numeric', 'min:0'],
            'budgets.*.planned_amount' => ['required', 'numeric', 'min:0'],
            'budgets.*.actual_amount' => ['nullable', 'numeric', 'min:0'],
            'budgets.*.status' => ['nullable', 'string'],
            'budgets.*.note' => ['nullable', 'string'],
            'budgets.*.category_index' => ['nullable', 'integer', 'min:0'],
            'budgets.*.category_id' => ['nullable', 'integer', 'exists:project_category_budgets,id'],

            // Milestones
            'milestones' => ['nullable', 'array'],
            'milestones.*.id' => ['nullable', 'integer', 'exists:project_milestones,id'],
            'milestones.*.title' => ['required', 'string', 'max:255'],
            'milestones.*.description' => ['nullable', 'string'],
            'milestones.*.target_date' => ['required', 'date'],
            'milestones.*.actual_date' => ['nullable', 'date'],
            'milestones.*.status' => ['nullable', 'string', Rule::enum(MilestoneStatus::class)],

            // Issues
            'issues' => ['nullable', 'array'],
            'issues.*.id' => ['nullable', 'integer', 'exists:project_issues,id'],
            'issues.*.title' => ['required', 'string', 'max:255'],
            'issues.*.description' => ['nullable', 'string'],
            'issues.*.severity' => ['nullable', 'string', Rule::enum(IssueSeverity::class)],
            'issues.*.owner_id' => ['required', 'integer', 'exists:users,id'],
            'issues.*.status' => ['nullable', 'string', Rule::enum(IssueStatus::class)],

            // IDs to delete
            'delete_locations' => ['nullable', 'array'],
            'delete_locations.*' => ['integer', 'exists:project_locations,id'],
            'delete_documents' => ['nullable', 'array'],
            'delete_documents.*' => ['integer', 'exists:project_documents,id'],
            'delete_budgets' => ['nullable', 'array'],
            'delete_budgets.*' => ['integer', 'exists:project_budgets,id'],
            'delete_milestones' => ['nullable', 'array'],
            'delete_milestones.*' => ['integer', 'exists:project_milestones,id'],
            'delete_issues' => ['nullable', 'array'],
            'delete_issues.*' => ['integer', 'exists:project_issues,id'],
            'delete_categories' => ['nullable', 'array'],
            'delete_categories.*' => ['integer', 'exists:project_category_budgets,id'],
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
            'budgets.*.unit_price.required' => 'Harga satuan wajib diisi.',
            'budgets.*.unit_price.numeric' => 'Harga satuan harus berupa angka.',
            'budgets.*.planned_amount.required' => 'Jumlah budget yang direncanakan wajib diisi.',
            'budgets.*.planned_amount.numeric' => 'Jumlah budget harus berupa angka.',
            'budgets.*.category_id.exists' => 'Kategori budget tidak ditemukan.',

            // Milestones
            'milestones.array' => 'Milestone harus berupa array.',
            'milestones.*.title.required' => 'Judul milestone wajib diisi.',
            'milestones.*.target_date.required' => 'Target tanggal wajib diisi.',
            'milestones.*.target_date.date' => 'Target tanggal harus berupa tanggal yang valid.',

            // Issues
            'issues.array' => 'Issue harus berupa array.',
            'issues.*.title.required' => 'Judul issue wajib diisi.',
            'issues.*.owner_id.required' => 'Owner issue wajib dipilih.',
            'issues.*.owner_id.exists' => 'Owner tidak ditemukan.',
        ];
    }
}
