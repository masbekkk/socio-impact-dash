<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Project;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectService
{
    public function createProject(array $data, int $creatorId): Project
    {
        return DB::transaction(function () use ($data, $creatorId) {
            $project = $this->createProjectRecord($data, $creatorId);

            $this->syncRelation($project->locations(), $data['locations'] ?? []);
            $this->syncDocuments($project, $data['documents'] ?? [], $creatorId);
            $this->syncRelation($project->budgets(), $data['budgets'] ?? []);
            $this->syncRelation($project->milestones(), $data['milestones'] ?? []);

            return $project->load(['locations', 'documents', 'budgets', 'milestones']);
        });
    }

    public function updateProject(Project $project, array $data, int $userId): Project
    {
        return DB::transaction(function () use ($project, $data, $userId) {
            $this->updateProjectRecord($project, $data);
            $this->deleteItems($project, $data);

            $this->syncRelation($project->locations(), $data['locations'] ?? [], true);
            $this->syncDocuments($project, $data['documents'] ?? [], $userId, true);
            $this->syncRelation($project->budgets(), $data['budgets'] ?? [], true);
            $this->syncRelation($project->milestones(), $data['milestones'] ?? [], true);
            $this->syncRelation($project->issues(), $data['issues'] ?? [], true);

            return $project->fresh(['locations', 'documents', 'budgets', 'milestones', 'issues']);
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

        // Special handling for documents (delete files first)
        if (!empty($data['delete_documents'])) {
            $docs = $project->documents()->whereIn('id', $data['delete_documents'])->get();
            foreach ($docs as $doc) {
                Storage::disk('public')->delete($doc->path);
            }
            $project->documents()->whereIn('id', $data['delete_documents'])->delete();
        }
    }

    /**
     * Generic sync method for simple relations (locations, budgets, milestones, issues)
     */
    private function syncRelation($relation, array $items, bool $allowUpdate = false): void
    {
        foreach ($items as $item) {
            if ($allowUpdate && !empty($item['id'])) {
                $relation->where('id', $item['id'])->update($this->extractData($item));
            } else {
                $relation->create($this->extractData($item));
            }
        }
    }

    /**
     * Extract data from item, removing 'id' field
     */
    private function extractData(array $item): array
    {
        unset($item['id']);
        return $item;
    }

    /**
     * Sync documents with file handling
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
