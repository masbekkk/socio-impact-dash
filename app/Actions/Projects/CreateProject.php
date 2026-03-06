<?php

declare(strict_types=1);

namespace App\Actions\Projects;

use App\Models\Project;
use App\Services\FileUploadService;
use Illuminate\Support\Facades\DB;

final class CreateProject
{
    // Constructor removed as FileUploadService is unused

    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data, int $userId): Project
    {
        /** @var Project $project */
        $project = DB::transaction(function () use ($data, $userId) {
            $project = $this->createProjectRecord($data, $userId);

            if (isset($data['locations'])) {
                /** @var array<int, array<string, mixed>> $locations */
                $locations = $data['locations'];
                $this->syncLocations($project, $locations);
            }

            if (isset($data['termin_payments'])) {
                /** @var array<int, array<string, mixed>> $terminPayments */
                $terminPayments = $data['termin_payments'];
                $this->syncTerminPayments($project, $terminPayments);
            }

            if (isset($data['documents'])) {
                /** @var array<int, array<string, mixed>> $documents */
                $documents = $data['documents'];
                $this->syncDocuments($project, $documents, $userId);
            }

            if (isset($data['detail_budgets'])) {
                /** @var array<int, array<string, mixed>> $detailBudgets */
                $detailBudgets = $data['detail_budgets'];
                $this->syncDetailBudgets($project, $detailBudgets, $userId);
            }

            $this->createApprovals($project);

            // Re-fetch project to load all newly created relations properly
            return $project->fresh(['locations', 'terminPayments', 'documents', 'budgetDetails']);
        });

        // Notify Finance + Direktur about new project
        $notifier = new \App\Actions\CreateNotification();
        $recipientIds = $notifier->getUserIdsByRoles(['finance', 'direktur']);
        if ($recipientIds !== []) {
            $notifier->handle(
                type: 'project_created',
                title: 'Proyek Baru Dibuat',
                message: "Proyek baru \"{$project->name}\" (#{$project->code}) telah dibuat.",
                recipientUserIds: $recipientIds,
                referenceType: 'project',
                referenceId: $project->id,
                createdBy: $userId,
            );
        }

        return $project;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function createProjectRecord(array $data, int $userId): Project
    {
        $code = is_string($data['code'] ?? null) ? $data['code'] : null;
        $budgetTotalRaw = $data['budget_total'] ?? 0;
        $budgetTotal = is_numeric($budgetTotalRaw) ? (float) $budgetTotalRaw : 0;

        return Project::create([
            'code' => $code,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'created_by' => $userId,
            'division_id' => $data['division_id'],
            'account_manager_id' => $data['account_manager_id'] ?? null,
            'head_id' => $data['head_id'] ?? null,
            'pic_id' => $data['pic_id'] ?? null,
            'status' => $data['status'] ?? \App\Enums\ProjectStatus::Active,
            'project_type' => $data['project_type'],
            'budget_total' => $budgetTotal,
            'operational_budget' => is_numeric($data['operational_budget'] ?? null) ? (float) $data['operational_budget'] : 0,
            'management_budget' => $data['management_budget'] ?? 0,
            'allowance_budget' => $data['allowance_budget'] ?? 0,
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
        ]);
    }

    /**
     * @param  array<int, array<string, mixed>>  $locations
     */
    private function syncLocations(Project $project, array $locations): void
    {
        foreach ($locations as $location) {
            $project->locations()->create([
                'latitude' => $location['latitude'],
                'longitude' => $location['longitude'],
                'detail_address' => $location['detail_address'],
            ]);
        }
    }

    /**
     * @param  array<int, array<string, mixed>>  $terminPayments
     */
    private function syncTerminPayments(Project $project, array $terminPayments): void
    {
        foreach ($terminPayments as $term) {
            $project->terminPayments()->create([
                'nominal' => $term['nominal'],
                'due_date' => $term['due_date'],
                'notes' => $term['notes'] ?? null,
            ]);
        }
    }

    /**
     * @param  array<int, array<string, mixed>>  $documents
     */
    private function syncDocuments(Project $project, array $documents, int $userId): void
    {
        foreach ($documents as $doc) {
            if (isset($doc['file']) && $doc['file'] instanceof \Illuminate\Http\UploadedFile) {
                $file = $doc['file'];

                // Save to temp local disk (fast, no external I/O)
                $tempPath = $file->store("temp/projects/{$project->id}", 'local');

                // Create document record immediately with pending status
                /** @var \App\Models\ProjectDocument $document */
                $document = $project->documents()->create([
                    'type' => $doc['type'] ?? 'other',
                    'original_name' => $file->getClientOriginalName(),
                    'path' => '', // Will be set by the job
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'uploaded_by' => $userId,
                    'upload_status' => 'pending',
                    'temp_path' => $tempPath,
                ]);

                // Dispatch background job to move file to final storage
                \App\Jobs\ProcessProjectDocumentUpload::dispatch(
                    (int) $document->id,
                    "projects/{$project->id}/documents"
                );
            }
        }
    }

    private function createApprovals(Project $project): void
    {
        // Finance Approval
        if ($project->account_manager_id) {
            $project->approvals()->create([
                'approved_by' => $project->account_manager_id,
                'approval_type' => 'finance',
                'approval_status' => 'pending',
            ]);
        }

        // HR Approval
        if ($project->head_id) {
            $project->approvals()->create([
                'approved_by' => $project->head_id,
                'approval_type' => 'hr',
                'approval_status' => 'pending',
            ]);
        }

        // Direktur Approval
        if ($project->pic_id) {
            $project->approvals()->create([
                'approved_by' => $project->pic_id,
                'approval_type' => 'direktur',
                'approval_status' => 'pending',
            ]);
        }
    }

    /**
     * @param  array<int, array<string, mixed>>  $detailBudgets
     */
    private function syncDetailBudgets(Project $project, array $detailBudgets, int $userId): void
    {
        foreach ($detailBudgets as $detail) {
            $project->budgetDetails()->create([
                'quantity' => $detail['quantity'] ?? 1,
                'item_price' => $detail['item_price'] ?? 0,
                'item_name' => $detail['item_name'] ?? null,
                'amount' => $detail['amount_pelaksanaan'] ?? $detail['amount'],
                'amount_pelaksanaan' => $detail['amount_pelaksanaan'] ?? null,
                'amount_proposal' => $detail['amount_proposal'] ?? null,
                'notes' => $detail['notes'] ?? null,
                'created_by' => $userId,
            ]);
        }
    }
}
