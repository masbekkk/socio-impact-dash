<?php

declare(strict_types=1);

namespace App\Actions\Projects;

use App\Models\Project;
use App\Services\FileUploadService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateProject
{
    public function __construct(protected FileUploadService $fileUploadService)
    {
    }

    public function handle(array $data, int $userId): Project
    {
        return DB::transaction(function () use ($data, $userId) {
            $project = $this->createProjectRecord($data, $userId);

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

            return $project->load(['locations', 'budgets', 'milestones', 'documents']);
        });
    }

    protected function createProjectRecord(array $data, int $userId): Project
    {
        $code = $data['code'] ?? $this->generateUniqueCode();
        
        $sowData = [];
        if (isset($data['sow']) && $data['sow'] instanceof \Illuminate\Http\UploadedFile) {
            $sowData = $this->fileUploadService->uploadFileWithPrefix(
                $data['sow'],
                'projects/sow',
                'sow_'
            );
        }

        $budgetTotal = $data['budget_total'] ?? 0;

        return Project::create([
            'code' => $code,
            'name' => $data['name'],
            'client' => $data['client'],
            'description' => $data['description'] ?? null,
            'user_id' => $userId,
            'division_id' => $data['division_id'],
            'account_manager_id' => $data['account_manager_id'],
            'head_id' => $data['head_id'],
            'pic_id' => $data['pic_id'],
            'status' => $data['status'] ?? 'draft',
            'project_type' => $data['project_type'],
            'sow_path' => $sowData['sow_path'] ?? null,
            'sow_original_name' => $sowData['sow_original_name'] ?? null,
            'sow_mime' => $sowData['sow_mime'] ?? null,
            'sow_size' => $sowData['sow_size'] ?? null,
            'budget_total' => $budgetTotal,
            'operational_budget' => $budgetTotal * 0.50,
            'management_budget' => $budgetTotal * 0.30,
            'allowance_budget' => $budgetTotal * 0.20,
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
        ]);
    }

    protected function generateUniqueCode(): string
    {
        do {
            $code = 'PRJ-' . strtoupper(Str::random(6));
        } while (Project::where('code', $code)->exists());

        return $code;
    }

    protected function syncLocations(Project $project, array $locations): void
    {
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
        foreach ($budgets as $budget) {
            $project->budgets()->create([
                'item_name' => $budget['item_name'],
                'quantity' => $budget['quantity'],
                'unit_price' => $budget['unit_price'],
                'planned_amount' => $budget['quantity'] * $budget['unit_price'],
                'category_id' => $budget['category_id'] ?? null,
                'status' => 'pending',
            ]);
        }
    }

    protected function syncMilestones(Project $project, array $milestones): void
    {
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
