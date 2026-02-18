<?php

declare(strict_types=1);

namespace App\Actions\Projects;

use App\Models\Project;
use App\Services\FileUploadService;
use Illuminate\Support\Facades\DB;

class UpdateProject
{
    public function __construct(protected FileUploadService $fileUploadService)
    {
    }

    public function handle(Project $project, array $data, int $userId): Project
    {
        return DB::transaction(function () use ($project, $data, $userId) {
            $this->updateProjectRecord($project, $data);

            if (isset($data['locations'])) {
                $this->syncLocations($project, $data['locations']);
            }

            if (isset($data['budgets'])) {
                $this->syncBudgets($project, $data['budgets']);
            }

            if (isset($data['milestones'])) {
                $this->syncMilestones($project, $data['milestones']);
            }

            if (isset($data['documents'])) {
                $this->syncDocuments($project, $data['documents'], $userId);
            }

            return $project->fresh(['locations', 'budgets', 'milestones', 'documents']);
        });
    }

    protected function updateProjectRecord(Project $project, array $data): void
    {
        $updateData = collect($data)->only([
            'name', 'client', 'description', 'division_id',
            'account_manager_id', 'head_id', 'pic_id',
            'status', 'project_type', 'budget_total',
            'start_date', 'end_date',
        ])->toArray();

        // Handle SOW file replacement
        if (isset($data['sow']) && $data['sow'] instanceof \Illuminate\Http\UploadedFile) {
            $sowData = $this->fileUploadService->replaceFileWithPrefix(
                $data['sow'],
                $project->sow_path,
                'projects/sow',
                'sow_'
            );
            $updateData = array_merge($updateData, $sowData);
        }

        if (isset($updateData['budget_total'])) {
            $budgetTotal = (float) $updateData['budget_total'];
            $updateData['operational_budget'] = $budgetTotal * 0.50;
            $updateData['management_budget'] = $budgetTotal * 0.30;
            $updateData['allowance_budget'] = $budgetTotal * 0.20;
        }

        if (!empty($updateData)) {
            $project->update($updateData);
        }
    }

    protected function syncLocations(Project $project, array $locations): void
    {
        // For simplicity, we'll replace all locations if they are passed as a full array
        // or we could do a more sophisticated diffing.
        $project->locations()->delete();
        foreach ($locations as $location) {
            $project->locations()->create([
                'latitude' => $location['latitude'],
                'longitude' => $location['longitude'],
                'detail_address' => $location['detail_address'],
            ]);
        }
    }

    protected function syncBudgets(Project $project, array $budgets): void
    {
        $project->budgets()->delete();
        foreach ($budgets as $budget) {
            $project->budgets()->create([
                'item_name' => $budget['item_name'],
                'quantity' => $budget['quantity'],
                'unit_price' => $budget['unit_price'],
                'planned_amount' => $budget['quantity'] * $budget['unit_price'],
                'category_id' => $budget['category_id'] ?? null,
                'status' => $budget['status'] ?? 'pending',
            ]);
        }
    }

    protected function syncMilestones(Project $project, array $milestones): void
    {
        $project->milestones()->delete();
        foreach ($milestones as $milestone) {
            $project->milestones()->create([
                'title' => $milestone['title'],
                'target_date' => $milestone['target_date'],
                'status' => $milestone['status'] ?? 'pending',
            ]);
        }
    }

    protected function syncDocuments(Project $project, array $documents, int $userId): void
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
}
