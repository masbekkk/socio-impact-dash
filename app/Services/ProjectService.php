<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectBudget;
use App\Models\ProjectCategoryBudget;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class ProjectService
{
    private $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function listProjects(array $filters = [], int $perPage = 15)
    {
        $query = Project::with([
            'division',
            'accountManager',
            'head',
            'pic',
            'issues',
            'milestones',
        ]);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['division_id'])) {
            $query->where('division_id', $filters['division_id']);
        }

        $query->orderBy('created_at', 'desc');

        return $query->paginate($perPage);
    }

    public function createProject(array $data, int $creatorId): Project
    {
        return DB::transaction(function () use ($data, $creatorId) {
            $project = $this->createProjectRecord($data, $creatorId);

            $this->syncLocations($project, $data['locations'] ?? []);
            $this->syncDocuments($project, $data['documents'] ?? [], $creatorId);

            $categoryIdMap = $this->syncCategories($data['categories'] ?? []);

            $this->syncBudgets($project, $data['budgets'] ?? [], $categoryIdMap);

            $this->syncMilestones($project, $data['milestones'] ?? []);

            return $project->load(['locations', 'documents', 'budgets', 'budgets.category', 'milestones']);
        });
    }

    public function updateProject(Project $project, array $data, int $userId): Project
    {
        return DB::transaction(function () use ($project, $data, $userId) {
            $this->updateProjectRecord($project, $data);
            $this->deleteRelatedProjectBudget($project, $data);

            $this->syncLocations($project, $data['locations'] ?? [], true);
            $this->syncDocuments($project, $data['documents'] ?? [], $userId, true);

            $categoryIdMap = $this->syncCategories($data['categories'] ?? [], true);

            $this->syncBudgets($project, $data['budgets'] ?? [], $categoryIdMap, true);

            $this->syncMilestones($project, $data['milestones'] ?? [], true);
            $this->syncIssues($project, $data['issues'] ?? [], $userId, true);

            return $project->fresh([
                'locations',
                'documents',
                'budgets',
                'budgets.category',
                'budgets.logs',
                'milestones',
                'issues',
            ]);
        });
    }

    private function generateProjectUniqueCode(): string
    {
        do {
            $code = mb_strtoupper(Str::random(6));
        } while (Project::where('code', $code)->exists());

        return $code;
    }

    private function createProjectRecord(array $data, int $creatorId): Project
    {
        $sowData = $this->handleSowUpload($data);

        return Project::create([
            'code' => $this->generateProjectUniqueCode(),
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'created_by' => $creatorId,
            'division_id' => $data['division_id'] ?? null,
            'account_manager_id' => $data['account_manager_id'] ?? null,
            'head_id' => $data['head_id'] ?? null,
            'pic_id' => $data['pic_id'] ?? null,
            'status' => $data['status'] ?? null,
            'project_type' => $data['project_type'],
            'budget_total' => $data['budget_total'] ?? null,
            'operational_budget' => ($data['budget_total'] ?? 0) * 0.50,
            'management_budget' => ($data['budget_total'] ?? 0) * 0.30,
            'allowance_budget' => ($data['budget_total'] ?? 0) * 0.20,
            'start_date' => $data['start_date'] ?? null,
            'end_date' => $data['end_date'] ?? null,
        ]);
    }

    private function updateProjectRecord(Project $project, array $data): void
    {
        $updateData = [];

        $fields = [
            'name', 'description', 'division_id',
            'account_manager_id', 'head_id', 'pic_id',
            'status', 'project_type', 'budget_total',
            'start_date', 'end_date',
        ];

        foreach ($fields as $field) {
            if (array_key_exists($field, $data)) {
                $updateData[$field] = $data[$field];
            }
        }

        if (array_key_exists('budget_total', $data)) {
            $updateData['operational_budget'] = $data['budget_total'] * 0.50;
            $updateData['management_budget'] = $data['budget_total'] * 0.30;
            $updateData['allowance_budget'] = $data['budget_total'] * 0.20;
        }

        if (! empty($updateData)) {
            $project->update($updateData);
        }
    }

    private function deleteRelatedProjectBudget(Project $project, array $data): void
    {
        $categoryIdsToRecalculate = [];

        if (! empty($data['delete_categories'])) {
            ProjectBudget::where('project_id', $project->id)
                ->whereIn('category_id', $data['delete_categories'])
                ->delete();
            ProjectCategoryBudget::whereIn('id', $data['delete_categories'])->delete();
        }

        if (! empty($data['delete_budgets'])) {
            $budgetsToDelete = $project->budgets()->whereIn('id', $data['delete_budgets'])->get();
            foreach ($budgetsToDelete as $budget) {
                if ($budget->category_id) {
                    $categoryIdsToRecalculate[] = $budget->category_id;
                }
            }
            $project->budgets()->whereIn('id', $data['delete_budgets'])->delete();
        }

        foreach (array_unique($categoryIdsToRecalculate) as $categoryId) {
            $this->updateCategoryTotalAmount($categoryId);
        }
    }

    private function syncLocations(Project $project, array $locations, bool $allowUpdate = false): void
    {
        $fields = ['latitude', 'longitude', 'detail_address'];

        foreach ($locations as $location) {
            if ($allowUpdate && ! empty($location['id'])) {
                $updateData = $this->extractUpdateData($location, $fields);
                if (! empty($updateData)) {
                    $project->locations()->where('id', $location['id'])->update($updateData);
                }
            } else {
                $project->locations()->create([
                    'latitude' => $location['latitude'] ?? null,
                    'longitude' => $location['longitude'] ?? null,
                    'detail_address' => $location['detail_address'] ?? null,
                ]);
            }
        }
    }

    private function extractUpdateData(array $data, array $fields): array
    {
        $updateData = [];
        foreach ($fields as $field) {
            if (array_key_exists($field, $data)) {
                $updateData[$field] = $data[$field];
            }
        }

        return $updateData;
    }

    /**
     * Sync documents - partial update support
     */
    private function syncDocuments(Project $project, array $documents, int $uploaderId, bool $allowUpdate = false): void
    {
        foreach ($documents as $document) {
            if ($allowUpdate && ! empty($document['id'])) {
                $this->updateDocument($project, $document);
            } elseif (! empty($document['file'])) {
                $this->createDocument($project, $document, $uploaderId);
            }
        }
    }

    private function createDocument(Project $project, array $document, int $uploaderId): void
    {
        $fileMetadata = $this->fileUploadService->uploadFile(
            $document['file'],
            "projects/{$project->id}/documents"
        );

        $project->documents()->create([
            'type' => $document['type'] ?? null,
            'original_name' => $fileMetadata['original_name'],
            'path' => $fileMetadata['path'],
            'mime' => $fileMetadata['mime'],
            'size' => $fileMetadata['size'],
            'uploaded_by' => $uploaderId,
        ]);
    }

    private function updateDocument(Project $project, array $document): void
    {
        $existingDoc = $project->documents()->find($document['id']);

        if (! $existingDoc) {
            return;
        }

        $updateData = [];

        // Only update type if provided
        if (array_key_exists('type', $document)) {
            $updateData['type'] = $document['type'];
        }

        // Handle file replacement
        if (! empty($document['file'])) {
            $fileMetadata = $this->fileUploadService->replaceFile(
                $document['file'],
                $existingDoc->path,
                "projects/{$project->id}/documents"
            );
            $updateData = array_merge($updateData, $fileMetadata);
        }

        if (! empty($updateData)) {
            $existingDoc->update($updateData);
        }
    }
}
