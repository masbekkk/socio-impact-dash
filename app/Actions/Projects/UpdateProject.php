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

            return $project->fresh(['locations', 'terminPayments', 'documents']);
        });
    }

    private function updateProjectRecord(Project $project, array $data): void
    {
        $updateData = collect($data)->only([
            'code', 'name', 'description', 'division_id',
            'status', 'project_type', 'budget_total', 'head_id', 'account_manager_id', 'pic_id',
            'start_date', 'end_date', 'actual_budget',
        ])->toArray();

        if (isset($updateData['budget_total'])) {
            $budgetTotal = (float) $updateData['budget_total'];
            $updateData['operational_budget'] = $budgetTotal * 0.5;
            $updateData['management_budget'] = $budgetTotal * 0.3;
            $updateData['allowance_budget'] = $budgetTotal * 0.2;
        }

        if (! empty($updateData)) {
            $project->update($updateData);
        }
    }

    private function syncLocations(Project $project, array $locations): void
    {
        // For simplicity, we'll replace all locations if they are passed as a full array
        // or we could do a more sophisticated diffing.
        // Actually, let's just update or create based on ID
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
                // Determine if we are replacing or adding
                if (isset($doc['id'])) {
                    $existingDoc = $project->documents()->find($doc['id']);
                    if ($existingDoc) {
                        $meta = $this->fileUploadService->replaceFile(
                            $doc['file'],
                            $existingDoc->path,
                            "projects/{$project->id}/documents"
                        );
                        $existingDoc->update(array_merge($meta, ['type' => $doc['type'] ?? $existingDoc->type]));

                        continue;
                    }
                }

                $meta = $this->fileUploadService->uploadFile(
                    $doc['file'],
                    "projects/{$project->id}/documents"
                );

                $project->documents()->create([
                    'type' => $doc['type'] ?? 'other',
                    'original_name' => $meta['original_name'],
                    'path' => $meta['path'],
                    'mime' => $meta['mime'],
                    'size' => $meta['size'],
                    'uploaded_by' => $userId,
                ]);
            }
        }
    }

    private function syncApprovals(Project $project): void
    {
        // Helper to update or create approval
        $updateOrCreate = function ($type, $userId) use ($project) {
            if ($userId) {
                $project->approvals()->updateOrCreate(
                    ['approval_type' => $type],
                    ['approved_by' => $userId]
                );
            } else {
                // If user is removed, we might want to delete the approval or keep it.
                // For now, let's keep it but maybe it should be considered void?
                // The current requirement implies strict mapping, so let's delete if no user.
                $project->approvals()->where('approval_type', $type)->delete();
            }
        };

        $updateOrCreate('finance', $project->account_manager_id);
        $updateOrCreate('hr', $project->head_id);
        $updateOrCreate('direktur', $project->pic_id);
    }
}
