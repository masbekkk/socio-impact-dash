<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectBudget;
use App\Models\ProjectBudgetLog;
use App\Models\ProjectCategoryBudget;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectService
{   
    protected $fileUploadService; 
    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
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
                'issues'
            ]);
        });
    }

    private function generateProjectUniqueCode(): string
    { 
        do {
            $code = strtoupper(Str::random(6));
        } while (Project::where('code', $code)->exists());
        
        return $code;
    }

    private function createProjectRecord(array $data, int $creatorId): Project
    {
        $sowData = $this->handleSowUpload($data);
        
        return Project::create([
            'code' => $this->generateProjectUniqueCode(),
            'name' => $data['name'],
            'client' => $data['client'],
            'description' => $data['description'] ?? null,
            'user_id' => $creatorId,
            'division_id' => $data['division_id'] ?? null,
            'account_manager_id' => $data['account_manager_id'] ?? null,
            'head_id' => $data['head_id'] ?? null,
            'pic_id' => $data['pic_id'] ?? null,
            'status' => $data['status'] ?? null,
            'project_type' => $data['project_type'],
            'sow_path' => $sowData['sow_path'] ?? null,
            'sow_original_name' => $sowData['sow_original_name'] ?? null,
            'sow_mime' => $sowData['sow_mime'] ?? null,
            'sow_size' => $sowData['sow_size'] ?? null,
            'budget_total' => $data['budget_total'] ?? null,
        ]);
    }

    private function handleSowUpload(array $data): array
    {
        if (empty($data['sow']) || !($data['sow'] instanceof UploadedFile)) {
            return [];
        }

        return $this->fileUploadService->uploadFileWithPrefix(
            $data['sow'], 
            'projects/sow', 
            'sow_'
        );
    }

    private function updateProjectRecord(Project $project, array $data): void
    {
        $updateData = [];
        
        $fields = [
            'name', 'client', 'description', 'division_id', 
            'account_manager_id', 'head_id', 'pic_id', 
            'status', 'project_type', 'budget_total'
        ];
        
        foreach ($fields as $field) {
            if (array_key_exists($field, $data)) {
                $updateData[$field] = $data[$field];
            }
        }
        
        // Handle SOW file upload
        if (!empty($data['sow']) && $data['sow'] instanceof \Illuminate\Http\UploadedFile) {
            $sowData = $this->fileUploadService->replaceFileWithPrefix(
                $data['sow'],
                $project->sow_path,
                'projects/sow',
                'sow_'
            );
            $updateData = array_merge($updateData, $sowData);
        }
        
        if (!empty($updateData)) {
            $project->update($updateData);
        }
    }

    private function deleteRelatedProjectBudget(Project $project, array $data): void
    {
        $categoryIdsToRecalculate = [];

        if (!empty($data['delete_categories'])) {
            ProjectBudget::where('project_id', $project->id)
                ->whereIn('category_id', $data['delete_categories'])
                ->delete();
            ProjectCategoryBudget::whereIn('id', $data['delete_categories'])->delete();
        }

        if (!empty($data['delete_budgets'])) {
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
            if ($allowUpdate && !empty($location['id'])) {
                $updateData = $this->extractUpdateData($location, $fields);
                if (!empty($updateData)) {
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

    private function syncMilestones(Project $project, array $milestones, bool $allowUpdate = false): void
    {
        $fields = ['title', 'description', 'target_date', 'actual_date', 'status'];
        
        foreach ($milestones as $milestone) {
            if ($allowUpdate && !empty($milestone['id'])) {
                $updateData = $this->extractUpdateData($milestone, $fields);
                if (!empty($updateData)) {
                    $project->milestones()->where('id', $milestone['id'])->update($updateData);
                }
            } else {
                $project->milestones()->create([
                    'title' => $milestone['title'],
                    'description' => $milestone['description'] ?? null,
                    'target_date' => $milestone['target_date'],
                    'actual_date' => $milestone['actual_date'] ?? null,
                    'status' => $milestone['status'] ?? 'pending',
                ]);
            }
        }
    }

    private function syncIssues(Project $project, array $issues, int $userId, bool $allowUpdate = false): void
    {
        $fields = ['title', 'description', 'severity', 'owner_id', 'status'];
        
        foreach ($issues as $issue) {
            if ($allowUpdate && !empty($issue['id'])) {
                $updateData = $this->extractUpdateData($issue, $fields);
                if (!empty($updateData)) {
                    $project->issues()->where('id', $issue['id'])->update($updateData);
                }
            } else {
                $project->issues()->create([
                    'title' => $issue['title'],
                    'description' => $issue['description'] ?? null,
                    'severity' => $issue['severity'] ?? 'medium',
                    'owner_id' => $issue['owner_id'] ?? $userId,
                    'status' => $issue['status'] ?? 'open',
                ]);
            }
        }
    }

    private function syncCategories(array $categories, bool $allowUpdate = false): array
    {
        $categoryIdMap = [];
        $fields = ['name', 'status'];
        
        foreach ($categories as $index => $categoryData) {
            $categoryId = null;
            
            if ($allowUpdate && !empty($categoryData['id'])) {
                $category = ProjectCategoryBudget::find($categoryData['id']);
                if ($category) {
                    $updateData = $this->extractUpdateData($categoryData, $fields);
                    if (!empty($updateData)) {
                        $category->update($updateData);
                    }
                    $categoryId = $category->id;
                }
            } else {
                $category = ProjectCategoryBudget::create([
                    'name' => $categoryData['name'],
                    'total_amount' => 0,
                    'status' => $categoryData['status'] ?? 'pending',
                ]);
                $categoryId = $category->id;
            }
            
            $categoryIdMap[$index] = $categoryId;
        }
        
        return $categoryIdMap;
    }

    private function syncBudgets(Project $project, array $budgets, array $categoryIdMap, bool $allowUpdate = false): void
    {
        $fields = ['item_name', 'quantity', 'unit_price', 'actual_amount', 'status'];
        
        foreach ($budgets as $budget) {
            $categoryId = $this->resolveCategoryId($budget, $categoryIdMap);

            if ($allowUpdate && !empty($budget['id'])) {
                $existingBudget = $project->budgets()->find($budget['id']);
                
                if ($existingBudget) {
                    $updateData = $this->extractUpdateData($budget, $fields);
                  
                    $oldCategoryId = $existingBudget->category_id;
  
                    if ($categoryId !== null) {
                        $updateData['category_id'] = $categoryId;
                    }

                    $newQuantity = $updateData['quantity'] ?? $existingBudget->quantity;
                    $newUnitPrice = $updateData['unit_price'] ?? $existingBudget->unit_price;
                    $newPlannedAmount = $newQuantity * $newUnitPrice;
 
                    if ($existingBudget->planned_amount != $newPlannedAmount) {
                        $this->createBudgetLog($existingBudget, $newPlannedAmount, $budget['note'] ?? null);
                    }
                    
                    $updateData['planned_amount'] = $newPlannedAmount;
                    
                    if (!empty($updateData)) {
                        $existingBudget->update($updateData);
                    }
        
                    if ($categoryId) {
                        $this->updateCategoryTotalAmount($categoryId);
                    }
                    
                    if ($oldCategoryId && $oldCategoryId != $categoryId) {
                        $this->updateCategoryTotalAmount($oldCategoryId);
                    }
                }
            } else {
                $plannedAmount = $budget['quantity'] * $budget['unit_price'];
                
                $project->budgets()->create([
                    'item_name' => $budget['item_name'],
                    'quantity' => $budget['quantity'],
                    'unit_price' => $budget['unit_price'],
                    'category_id' => $categoryId,
                    'planned_amount' => $plannedAmount,
                    'actual_amount' => $budget['actual_amount'] ?? 0,
                    'status' => $budget['status'] ?? 'pending',
                ]);

                if ($categoryId) {
                    $this->updateCategoryTotalAmount($categoryId);
                }
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

    private function resolveCategoryId(array $budget, array $categoryIdMap): ?int
    {
        if (isset($budget['category_index']) && isset($categoryIdMap[$budget['category_index']])) {
            return $categoryIdMap[$budget['category_index']];
        }

        if (!empty($budget['category_id'])) {
            return (int) $budget['category_id'];
        }

        return null;
    }

    private function updateCategoryTotalAmount(int $categoryId): void
    {
        $category = ProjectCategoryBudget::find($categoryId);
        if ($category) {
            // Only sum non-deleted budgets (soft deleted are automatically excluded)
            $totalPlanned = ProjectBudget::where('category_id', $categoryId)
                ->sum('planned_amount');
            $category->update(['total_amount' => $totalPlanned]);
        }
    }

    private function createBudgetLog(ProjectBudget $budget, float $newAmount, ?string $note = null, int $userId = 1, string $action = 'update'): void
    {
        ProjectBudgetLog::create([
            'user_id' => $userId,
            'action' => $action,
            'project_budget_id' => $budget->id,
            'old_planned_amount' => $budget->planned_amount,
            'new_planned_amount' => $newAmount,
            'note' => $note,
        ]);
    }

    /**
     * Sync documents - partial update support
     */
    private function syncDocuments(Project $project, array $documents, int $uploaderId, bool $allowUpdate = false): void
    {
        foreach ($documents as $document) {
            if ($allowUpdate && !empty($document['id'])) {
                $this->updateDocument($project, $document);
            } elseif (!empty($document['file'])) {
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
        
        if (!$existingDoc) {
            return;
        }

        $updateData = [];
        
        // Only update type if provided
        if (array_key_exists('type', $document)) {
            $updateData['type'] = $document['type'];
        }

        // Handle file replacement
        if (!empty($document['file'])) {
            $fileMetadata = $this->fileUploadService->replaceFile(
                $document['file'],
                $existingDoc->path,
                "projects/{$project->id}/documents"
            );
            $updateData = array_merge($updateData, $fileMetadata);
        }

        if (!empty($updateData)) {
            $existingDoc->update($updateData);
        }
    }
}
