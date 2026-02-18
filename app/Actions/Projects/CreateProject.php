<?php

declare(strict_types=1);

namespace App\Actions\Projects;

use App\Models\Project;
use App\Services\FileUploadService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class CreateProject
{
    public function __construct(private FileUploadService $fileUploadService) {}

    public function handle(array $data, int $userId): Project
    {
        return DB::transaction(function () use ($data, $userId) {
            $project = $this->createProjectRecord($data, $userId);

            if (isset($data['locations'])) {
                $this->syncLocations($project, $data['locations']);
            }

            if (isset($data['termin_payments'])) {
                $this->syncTerminPayments($project, $data['termin_payments']);
            }

            if (isset($data['documents'])) {
                $this->syncDocuments($project, $data['documents'], $userId);
            }

            return $project->load(['locations', 'terminPayments', 'documents']);
        });
    }

    private function createProjectRecord(array $data, int $userId): Project
    {
        $code = $data['code'] ?? $this->generateUniqueCode();
        $budgetTotal = (float) ($data['budget_total'] ?? 0);

        return Project::create([
            'code' => $code,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'created_by' => $userId,
            'division_id' => $data['division_id'],
            'account_manager_id' => $data['account_manager_id'],
            'head_id' => $data['head_id'],
            'pic_id' => $data['pic_id'],
            'status' => $data['status'] ?? ProjectStatus::Active,
            'project_type' => $data['project_type'],
            'budget_total' => $budgetTotal,
            'operational_budget' => $budgetTotal * 0.5,
            'management_budget' => $budgetTotal * 0.3,
            'allowance_budget' => $budgetTotal * 0.2,
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
        ]);
    }

    private function generateUniqueCode(): string
    {
        do {
            $code = 'PRJ-'.mb_strtoupper(Str::random(6));
        } while (Project::where('code', $code)->exists());

        return $code;
    }

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

    private function syncDocuments(Project $project, array $documents, int $userId): void
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
