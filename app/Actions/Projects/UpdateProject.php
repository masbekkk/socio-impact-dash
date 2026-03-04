<?php

declare(strict_types=1);

namespace App\Actions\Projects;

use App\Models\Project;
use App\Services\FileUploadService;
use Illuminate\Support\Facades\DB;

final class UpdateProject
{
    public function __construct(private FileUploadService $fileUploadService) {}

    public function handle(Project $project, array $data, int $userId): Project
    {
        return DB::transaction(function () use ($project, $data, $userId) {
            $this->updateProjectRecord($project, $data);

            if (isset($data['locations'])) {
                $this->syncLocations($project, $data['locations']);
            }

            if (isset($data['termin_payments'])) {
                $this->syncTerminPayments($project, $data['termin_payments']);
            }

            if (isset($data['documents'])) {
                $this->syncDocuments($project, $data['documents'], $userId);
            }

            if (isset($data['detail_budgets'])) {
                $this->syncDetailBudgets($project, $data['detail_budgets'], $userId);
            }

            $this->syncApprovals($project);

            // Handle deletions
            if (isset($data['delete_locations'])) {
                $project->locations()->whereIn('id', $data['delete_locations'])->delete();
            }
            if (isset($data['delete_documents'])) {
                // Should also delete file from storage in real app
                $project->documents()->whereIn('id', $data['delete_documents'])->delete();
            }
            if (isset($data['delete_termin_payments'])) {
                $project->terminPayments()->whereIn('id', $data['delete_termin_payments'])->delete();
            }
            if (isset($data['delete_detail_budgets'])) {
                $project->budgetDetails()->whereIn('id', $data['delete_detail_budgets'])->delete();
            }

            return $project->fresh(['locations', 'terminPayments', 'documents', 'budgetDetails']);
        });
    }

    private function updateProjectRecord(Project $project, array $data): void
    {
        $updateData = collect($data)->only([
            'code', 'name', 'description', 'division_id',
            'status', 'project_type', 'budget_total', 'head_id', 'account_manager_id', 'pic_id',
            'start_date', 'end_date', 'actual_budget',
            'operational_budget', 'management_budget', 'allowance_budget', 'budget_partition_status',
            'lesson_learned',
        ])->toArray();

        if (! empty($updateData)) {
            $project->update($updateData);
        }
    }

    // ... keeping other syncing methods untouched ...
    private function syncLocations(Project $project, array $locations): void
    {
        foreach ($locations as $location) {
            if (isset($location['id'])) {
                $project->locations()->where('id', $location['id'])->update([
                    'latitude' => $location['latitude'],
                    'longitude' => $location['longitude'],
                    'detail_address' => $location['detail_address'],
                ]);
            } else {
                $project->locations()->create([
                    'latitude' => $location['latitude'],
                    'longitude' => $location['longitude'],
                    'detail_address' => $location['detail_address'],
                ]);
            }
        }
    }

    private function syncTerminPayments(Project $project, array $terminPayments): void
    {
        foreach ($terminPayments as $term) {
            if (isset($term['id'])) {
                $project->terminPayments()->where('id', $term['id'])->update([
                    'nominal' => $term['nominal'],
                    'due_date' => $term['due_date'],
                    'notes' => $term['notes'] ?? null,
                ]);
            } else {
                $project->terminPayments()->create([
                    'nominal' => $term['nominal'],
                    'due_date' => $term['due_date'],
                    'notes' => $term['notes'] ?? null,
                ]);
            }
        }
    }

    private function syncDocuments(Project $project, array $documents, int $userId): void
    {
        foreach ($documents as $doc) {
            if (isset($doc['file']) && $doc['file'] instanceof \Illuminate\Http\UploadedFile) {
                $file = $doc['file'];

                // Save to temp local disk (fast, no external I/O)
                $tempPath = $file->store("temp/projects/{$project->id}", 'local');

                // If replacing an existing document
                if (isset($doc['id'])) {
                    $existingDoc = $project->documents()->find($doc['id']);
                    if ($existingDoc) {
                        // Delete old file from final storage
                        if ($existingDoc->path) {
                            \Illuminate\Support\Facades\Storage::disk('public')->delete($existingDoc->path);
                        }

                        $existingDoc->update([
                            'type' => $doc['type'] ?? $existingDoc->type,
                            'original_name' => $file->getClientOriginalName(),
                            'path' => '', // Will be set by the job
                            'mime' => $file->getClientMimeType(),
                            'size' => $file->getSize(),
                            'upload_status' => 'pending',
                            'temp_path' => $tempPath,
                        ]);

                        \App\Jobs\ProcessProjectDocumentUpload::dispatch(
                            $existingDoc->id,
                            "projects/{$project->id}/documents"
                        );

                        continue;
                    }
                }

                // Create new document record
                $document = $project->documents()->create([
                    'type' => $doc['type'] ?? 'other',
                    'original_name' => $file->getClientOriginalName(),
                    'path' => '',
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'uploaded_by' => $userId,
                    'upload_status' => 'pending',
                    'temp_path' => $tempPath,
                ]);

                \App\Jobs\ProcessProjectDocumentUpload::dispatch(
                    $document->id,
                    "projects/{$project->id}/documents"
                );
            }
        }
    }

    private function syncDetailBudgets(Project $project, array $detailBudgets, int $userId): void
    {
        foreach ($detailBudgets as $detail) {
            if (isset($detail['id'])) {
                $project->budgetDetails()->where('id', $detail['id'])->update([
                    'quantity' => $detail['quantity'] ?? 1,
                    'item_price' => $detail['item_price'] ?? 0,
                    'amount' => $detail['amount'],
                    'amount_pelaksanaan' => $detail['amount_pelaksanaan'] ?? null,
                    'amount_proposal' => $detail['amount_proposal'] ?? null,
                    'notes' => $detail['notes'] ?? null,
                ]);
            } else {
                $project->budgetDetails()->create([
                    'quantity' => $detail['quantity'] ?? 1,
                    'item_price' => $detail['item_price'] ?? 0,
                    'amount' => $detail['amount'],
                    'amount_pelaksanaan' => $detail['amount_pelaksanaan'] ?? null,
                    'amount_proposal' => $detail['amount_proposal'] ?? null,
                    'notes' => $detail['notes'] ?? null,
                    'created_by' => $userId,
                ]);
            }
        }
    }

    private function syncApprovals(Project $project): void
    {
        $updateOrCreate = function (string $type, ?int $userId) use ($project): void {
            if ($userId) {
                $project->approvals()->updateOrCreate(
                    ['approval_type' => $type],
                    ['approved_by' => $userId]
                );
            } else {
                $project->approvals()->where('approval_type', $type)->delete();
            }
        };

        $updateOrCreate('finance', $project->account_manager_id !== null ? (int) $project->account_manager_id : null);
        $updateOrCreate('hr', $project->head_id !== null ? (int) $project->head_id : null);
        $updateOrCreate('direktur', $project->pic_id !== null ? (int) $project->pic_id : null);
    }
}
