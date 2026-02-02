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

            // Categories - 'sometimes' for partial updates
            'categories' => ['nullable', 'array'],
            'categories.*.id' => ['nullable', 'integer', 'exists:project_category_budgets,id'],
            'categories.*.name' => ['sometimes', 'string', 'max:255'],
            'categories.*.status' => ['sometimes', 'string'],

            // Budgets - 'sometimes' for partial updates
            'budgets' => ['nullable', 'array'],
            'budgets.*.id' => ['nullable', 'integer', 'exists:project_budgets,id'],
            'budgets.*.item_name' => ['sometimes', 'string', 'max:255'],
            'budgets.*.quantity' => ['sometimes', 'integer', 'min:1'],
            'budgets.*.unit_price' => ['sometimes', 'numeric', 'min:0'],
            'budgets.*.actual_amount' => ['sometimes', 'numeric', 'min:0'],
            'budgets.*.status' => ['sometimes', 'string'],
            'budgets.*.note' => ['nullable', 'string'],
            'budgets.*.category_index' => ['nullable', 'integer', 'min:0'],
            'budgets.*.category_id' => ['nullable', 'integer', 'exists:project_category_budgets,id'],

            // Milestones - 'sometimes' for partial updates
            'milestones' => ['nullable', 'array'],
            'milestones.*.id' => ['nullable', 'integer', 'exists:project_milestones,id'],
            'milestones.*.title' => ['sometimes', 'string', 'max:255'],
            'milestones.*.description' => ['sometimes', 'string'],
            'milestones.*.target_date' => ['sometimes', 'date'],
            'milestones.*.actual_date' => ['sometimes', 'date'],
            'milestones.*.status' => ['sometimes', 'string', Rule::enum(MilestoneStatus::class)],

            // Issues - 'sometimes' for partial updates
            'issues' => ['nullable', 'array'],
            'issues.*.id' => ['nullable', 'integer', 'exists:project_issues,id'],
            'issues.*.title' => ['sometimes', 'string', 'max:255'],
            'issues.*.description' => ['sometimes', 'string'],
            'issues.*.severity' => ['sometimes', 'string', Rule::enum(IssueSeverity::class)],
            'issues.*.owner_id' => ['sometimes', 'integer', 'exists:users,id'],
            'issues.*.status' => ['sometimes', 'string', Rule::enum(IssueStatus::class)],

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

            // Categories
            'categories.array' => 'Kategori harus berupa array.',
            'categories.*.name.string' => 'Nama kategori harus berupa teks.',

            // Budgets
            'budgets.array' => 'Budget harus berupa array.',
            'budgets.*.item_name.string' => 'Nama item budget harus berupa teks.',
            'budgets.*.quantity.integer' => 'Jumlah item harus berupa angka bulat.',
            'budgets.*.quantity.min' => 'Jumlah item minimal 1.',
            'budgets.*.unit_price.numeric' => 'Harga satuan harus berupa angka.',
            'budgets.*.unit_price.min' => 'Harga satuan tidak boleh kurang dari 0.',
            'budgets.*.category_id.exists' => 'Kategori budget tidak ditemukan.',

            // Milestones
            'milestones.array' => 'Milestone harus berupa array.',
            'milestones.*.title.string' => 'Judul milestone harus berupa teks.',
            'milestones.*.target_date.date' => 'Target tanggal harus berupa tanggal yang valid.',

            // Issues
            'issues.array' => 'Issue harus berupa array.',
            'issues.*.title.string' => 'Judul issue harus berupa teks.',
            'issues.*.owner_id.exists' => 'Owner tidak ditemukan.',
        ];
    }
}
