<?php

declare(strict_types=1);

namespace App\Actions\Projects;

use App\Models\Project;
use App\Services\FileUploadService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

final readonly class CloseProject
{
    public function __construct(private FileUploadService $fileUploadService) {}

    public function handle(Project $project, array $data, int $userId): Project
    {
        return DB::transaction(function () use ($project, $data, $userId) {
            // Update actual budget and status
            $project->update([
                'actual_budget' => $data['actual_budget'] ?? $project->actual_budget,
                'status' => 'finished',
            ]);

            // Handle Documents
            if (isset($data['documents']) && is_array($data['documents'])) {
                foreach ($data['documents'] as $doc) {
                    if (isset($doc['file']) && $doc['file'] instanceof UploadedFile) {
                        // Check if file type already exists for this project
                        $existingDoc = $project->documents()->where('type', $doc['type'])->first();

                        if ($existingDoc) {
                            $meta = $this->fileUploadService->replaceFile(
                                $doc['file'],
                                $existingDoc->path,
                                "projects/{$project->id}/closing_documents"
                            );
                            $existingDoc->update($meta);
                        } else {
                            $meta = $this->fileUploadService->uploadFile(
                                $doc['file'],
                                "projects/{$project->id}/closing_documents"
                            );

                            $project->documents()->create([
                                'project_id' => $project->id,
                                'type' => $doc['type'],
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

            return $project->refresh();
        });
    }
}
