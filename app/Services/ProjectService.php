<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectBudget;
use App\Models\ProjectBudgetLog;
use App\Models\ProjectCategoryBudget;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectService
{
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
            $this->deleteItems($project, $data);

            $this->syncLocations($project, $data['locations'] ?? [], true);
            $this->syncDocuments($project, $data['documents'] ?? [], $userId, true);
            
            $categoryIdMap = $this->syncCategories($data['categories'] ?? [], true);
            
            $this->syncBudgets($project, $data['budgets'] ?? [], $categoryIdMap, true);
            
            $this->syncMilestones($project, $data['milestones'] ?? [], true);
            $this->syncIssues($project, $data['issues'] ?? [], true);

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
            'sow' => $data['sow'] ?? null,
            'budget_total' => $data['budget_total'] ?? null,
        ]);
    }

    private function updateProjectRecord(Project $project, array $data): void
    {
        $project->update([
            'name' => $data['name'],
            'client' => $data['client'],
            'description' => $data['description'] ?? null,
            'division_id' => $data['division_id'] ?? null,
            'account_manager_id' => $data['account_manager_id'] ?? null,
            'head_id' => $data['head_id'] ?? null,
            'pic_id' => $data['pic_id'] ?? null,
            'status' => $data['status'] ?? null,
            'project_type' => $data['project_type'],
            'sow' => $data['sow'] ?? null,
            'budget_total' => $data['budget_total'] ?? null,
        ]);
    }

    private function deleteItems(Project $project, array $data): void
    {
        $relations = ['locations', 'budgets', 'milestones', 'issues'];
        
        foreach ($relations as $relation) {
            $deleteKey = "delete_{$relation}";
            if (!empty($data[$deleteKey])) {
                $project->$relation()->whereIn('id', $data[$deleteKey])->delete();
            }
        }

        if (!empty($data['delete_documents'])) {
            $docs = $project->documents()->whereIn('id', $data['delete_documents'])->get();
            foreach ($docs as $doc) {
                Storage::disk('public')->delete($doc->path);
            }
            $project->documents()->whereIn('id', $data['delete_documents'])->delete();
        }

        if (!empty($data['delete_categories'])) {
            ProjectCategoryBudget::whereIn('id', $data['delete_categories'])
                ->whereDoesntHave('budgets')
                ->delete();
        }
    }

    private function syncLocations(Project $project, array $locations, bool $allowUpdate = false): void
    {
        foreach ($locations as $location) {
            $locationData = [
                'latitude' => $location['latitude'] ?? null,
                'longitude' => $location['longitude'] ?? null,
                'detail_address' => $location['detail_address'] ?? null,
            ];

            if ($allowUpdate && !empty($location['id'])) {
                $project->locations()->where('id', $location['id'])->update($locationData);
            } else {
                $project->locations()->create($locationData);
            }
        }
    }

    private function syncMilestones(Project $project, array $milestones, bool $allowUpdate = false): void
    {
        foreach ($milestones as $milestone) {
            $milestoneData = [
                'title' => $milestone['title'],
                'description' => $milestone['description'] ?? null,
                'target_date' => $milestone['target_date'],
                'actual_date' => $milestone['actual_date'] ?? null,
                'status' => $milestone['status'] ?? 'pending',
            ];

            if ($allowUpdate && !empty($milestone['id'])) {
                $project->milestones()->where('id', $milestone['id'])->update($milestoneData);
            } else {
                $project->milestones()->create($milestoneData);
            }
        }
    }

    private function syncIssues(Project $project, array $issues, bool $allowUpdate = false): void
    {
        foreach ($issues as $issue) {
            $issueData = [
                'title' => $issue['title'],
                'description' => $issue['description'] ?? null,
                'severity' => $issue['severity'] ?? 'medium',
                'owner_id' => $issue['owner_id'],
                'status' => $issue['status'] ?? 'open',
            ];

            if ($allowUpdate && !empty($issue['id'])) {
                $project->issues()->where('id', $issue['id'])->update($issueData);
            } else {
                $project->issues()->create($issueData);
            }
        }
    }

    private function syncCategories(array $categories, bool $allowUpdate = false): array
    {
        $categoryIdMap = [];
        
        foreach ($categories as $index => $categoryData) {
            $categoryId = null;
            
            if ($allowUpdate && !empty($categoryData['id'])) {
              
                $category = ProjectCategoryBudget::find($categoryData['id']);
                if ($category) {
                    $category->update([
                        'name' => $categoryData['name'],
                        'total_amount' => $categoryData['total_amount'] ?? $category->total_amount,
                        'status' => $categoryData['status'] ?? $category->status,
                    ]);
                    $categoryId = $category->id;
                }
            } else {
             
                $category = ProjectCategoryBudget::create([
                    'name' => $categoryData['name'],
                    'total_amount' => $categoryData['total_amount'] ?? 0,
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
        foreach ($budgets as $budget) {
            $categoryId = $this->resolveCategoryId($budget, $categoryIdMap);
            
            $budgetData = [
                'item_name' => $budget['item_name'],
                'quantity' => $budget['quantity'],
                'unit_price' => $budget['unit_price'],
                'category_id' => $categoryId,
                'planned_amount' => $budget['planned_amount'],
                'actual_amount' => $budget['actual_amount'] ?? 0,
                'status' => $budget['status'] ?? 'pending',
            ];

            if ($allowUpdate && !empty($budget['id'])) {
                $existingBudget = $project->budgets()->find($budget['id']);
                
                if ($existingBudget) {
                    if ($existingBudget->planned_amount != $budget['planned_amount']) {
                        $this->createBudgetLog($existingBudget, (float) $budget['planned_amount'], $budget['note'] ?? null);
                    }
                    
                    $existingBudget->update($budgetData);
                }
            } else {
                $project->budgets()->create($budgetData);
            }

            if ($categoryId) {
                $this->updateCategoryTotalAmount($categoryId);
            }
        }
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
            $totalPlanned = ProjectBudget::where('category_id', $categoryId)->sum('planned_amount');
            $category->update(['total_amount' => $totalPlanned]);
        }
    }

    private function createBudgetLog(ProjectBudget $budget, float $newAmount, ?string $note = null): void
    {
        ProjectBudgetLog::create([
            'project_budget_id' => $budget->id,
            'old_planned_amount' => $budget->planned_amount,
            'new_planned_amount' => $newAmount,
            'note' => $note,
        ]);
    }

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
        $file = $document['file'];
        
        $project->documents()->create([
            'type' => $document['type'] ?? null,
            'original_name' => $file->getClientOriginalName(),
            'path' => $file->store("projects/{$project->id}/documents", 'public'),
            'mime' => $file->getMimeType(),
            'size' => $file->getSize(),
            'uploaded_by' => $uploaderId,
        ]);
    }

    private function updateDocument(Project $project, array $document): void
    {
        $existingDoc = $project->documents()->find($document['id']);
        
        if (!$existingDoc) {
            return;
        }

        $updateData = ['type' => $document['type'] ?? $existingDoc->type];

        if (!empty($document['file'])) {
            Storage::disk('public')->delete($existingDoc->path);
            $file = $document['file'];
            $updateData = array_merge($updateData, [
                'original_name' => $file->getClientOriginalName(),
                'path' => $file->store("projects/{$project->id}/documents", 'public'),
                'mime' => $file->getMimeType(),
                'size' => $file->getSize(),
            ]);
        }

        $existingDoc->update($updateData);
    }
}
