<?php

declare(strict_types=1);

namespace App\Actions\Projects;

use App\Models\Project;
use App\Services\FileUploadService;
use Illuminate\Support\Facades\DB;

final class UpdateProject
{
    public function __construct(private FileUploadService $fileUploadService) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(Project $project, array $data, int $userId): Project
    {
        /** @var Project $updatedProject */
        $updatedProject = DB::transaction(function () use ($project, $data, $userId) {
            $this->updateProjectRecord($project, $data);

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

            if (isset($data['year_claims'])) {
                /** @var array<int, array<string, mixed>> $claims */
                $claims = $data['year_claims'];
                $this->syncYearClaims($project, $claims);
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
            if (isset($data['delete_year_claims'])) {
                $project->yearClaims()->whereIn('id', $data['delete_year_claims'])->delete();
            }

            return $project->fresh(['locations', 'terminPayments', 'documents', 'budgetDetails', 'yearClaims']);
        });

        return $updatedProject;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function updateProjectRecord(Project $project, array $data): void
    {
        $updateData = collect($data)->only([
            'code', 'name', 'client_name', 'initial_project', 'description', 'division_id',
            'status', 'project_type', 'budget_total', 'head_id', 'account_manager_id', 'pic_id',
            'start_date', 'end_date', 'actual_budget',
            'operational_budget', 'management_budget', 'allowance_budget', 'budget_partition_status',
            'lesson_learned',
        ])->toArray();

        // Safeguard: if budget partitions are updated but status is not explicitly sent, set to pending
        if (! isset($data['budget_partition_status'])) {
            $hasBudgetChange = array_any(['operational_budget', 'management_budget', 'allowance_budget'], fn ($key): bool => isset($data[$key]) && (float) $data[$key] !== (float) $project->$key);
            if ($hasBudgetChange) {
                $updateData['budget_partition_status'] = 'pending';
            }
        }

        if (! empty($updateData)) {
            /** @var array<string, mixed> $updateArray */
            $updateArray = $updateData;
            $project->update($updateArray);
        }
    }

    // ... keeping other syncing methods untouched ...
    /**
     * @param  array<int, array<string, mixed>>  $locations
     */
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

    /**
     * @param  array<int, array<string, mixed>>  $terminPayments
     */
    private function syncTerminPayments(Project $project, array $terminPayments): void
    {
        foreach ($terminPayments as $term) {
            $data = [
                'nominal' => $term['nominal'],
                'due_date' => $term['due_date'],
                'notes' => $term['notes'] ?? null,
                'nomor_surat' => $term['nomor_surat'] ?? null,
                'tertuju' => $term['tertuju'] ?? null,
            ];

            if (isset($term['id'])) {
                $existing = $project->terminPayments()->find($term['id']);
                if ($existing) {
                    if (isset($term['billing_file']) && $term['billing_file'] instanceof \Illuminate\Http\UploadedFile) {
                        $meta = $this->fileUploadService->replaceFile(
                            $term['billing_file'],
                            $existing->billing_document,
                            "projects/{$project->id}/termins"
                        );
                        $data['billing_document'] = $meta['path'];
                    }

                    if (isset($term['proof_file']) && $term['proof_file'] instanceof \Illuminate\Http\UploadedFile) {
                        $meta = $this->fileUploadService->replaceFile(
                            $term['proof_file'],
                            $existing->proof_payment,
                            "projects/{$project->id}/termins"
                        );
                        $data['proof_payment'] = $meta['path'];
                    }

                    $existing->update($data);
                }
            } else {
                if (isset($term['billing_file']) && $term['billing_file'] instanceof \Illuminate\Http\UploadedFile) {
                    $meta = $this->fileUploadService->uploadFile(
                        $term['billing_file'],
                        "projects/{$project->id}/termins"
                    );
                    $data['billing_document'] = $meta['path'];
                }

                if (isset($term['proof_file']) && $term['proof_file'] instanceof \Illuminate\Http\UploadedFile) {
                    $meta = $this->fileUploadService->uploadFile(
                        $term['proof_file'],
                        "projects/{$project->id}/termins"
                    );
                    $data['proof_payment'] = $meta['path'];
                }

                $project->terminPayments()->create($data);
            }
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

                // If replacing an existing document
                if (isset($doc['id'])) {
                    /** @var \App\Models\ProjectDocument|null $existingDoc */
                    $existingDoc = $project->documents()->find($doc['id']);
                    if ($existingDoc) {
                        // Delete old file from final storage
                        if ($existingDoc->path) {
                            \Illuminate\Support\Facades\Storage::disk('public')->delete((string) $existingDoc->path);
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

                        dispatch(new \App\Jobs\ProcessProjectDocumentUpload((int) $existingDoc->id, "projects/{$project->id}/documents"));

                        continue;
                    }
                }

                // Create new document record
                /** @var \App\Models\ProjectDocument $document */
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

                dispatch(new \App\Jobs\ProcessProjectDocumentUpload((int) $document->id, "projects/{$project->id}/documents"));
            }
        }
    }

    /**
     * @param  array<int, array<string, mixed>>  $detailBudgets
     */
    private function syncDetailBudgets(Project $project, array $detailBudgets, int $userId): void
    {
        foreach ($detailBudgets as $detail) {
            if (isset($detail['id'])) {
                $project->budgetDetails()->where('id', $detail['id'])->update([
                    'item_name' => $detail['item_name'] ?? null,
                    'quantity' => $detail['quantity'] ?? 1,
                    'item_price' => $detail['item_price'] ?? 0,
                    'amount' => isset($detail['amount_pelaksanaan']) && (float) $detail['amount_pelaksanaan'] > 0 ? $detail['amount_pelaksanaan'] : ($detail['amount'] ?? 0),
                    'amount_pelaksanaan' => $detail['amount_pelaksanaan'] ?? null,
                    'amount_proposal' => $detail['amount_proposal'] ?? null,
                    'notes' => $detail['notes'] ?? null,
                ]);
            } else {
                $project->budgetDetails()->create([
                    'item_name' => $detail['item_name'] ?? null,
                    'quantity' => $detail['quantity'] ?? 1,
                    'item_price' => $detail['item_price'] ?? 0,
                    'amount' => $detail['amount_pelaksanaan'] ?? $detail['amount'],
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

    /**
     * @param  array<int, array<string, mixed>>  $claims
     */
    private function syncYearClaims(Project $project, array $claims): void
    {
        foreach ($claims as $claim) {
            if (isset($claim['id'])) {
                $existing = $project->yearClaims()->find($claim['id']);
                if ($existing) {
                    $existing->update([
                        'year' => $claim['year'],
                        'amount' => $claim['amount'] ?? 0,
                    ]);
                }
            } else {
                $project->yearClaims()->create([
                    'year' => $claim['year'],
                    'amount' => $claim['amount'] ?? 0,
                ]);
            }
        }
    }
}
