<?php

declare(strict_types=1);

namespace App\Actions\Projects;

use App\Models\Project;
use App\Models\ProjectMonitoring;
use App\Services\FileUploadService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

final class StoreProjectMonitoring
{
    public function __construct(private FileUploadService $fileUploadService) {}

    public function handle(Project $project, array $data, int $userId): ProjectMonitoring
    {

        return DB::transaction(function () use ($project, $data, $userId) {
            $monitoring = $project->monitorings()->create([
                'report_date' => $data['report_date'],
                'notes' => $data['notes'] ?? null,
                'created_by' => $userId,
            ]);

            // Handle Attachments
            if (isset($data['documents']) && is_array($data['documents'])) {
                foreach ($data['documents'] as $doc) {
                    if (isset($doc['file']) && $doc['file'] instanceof UploadedFile) {
                        $meta = $this->fileUploadService->uploadFile(
                            $doc['file'],
                            "projects/{$project->id}/monitorings/{$monitoring->id}"
                        );

                        $monitoring->documents()->create([
                            'original_name' => $meta['original_name'],
                            'path' => $meta['path'],
                            'mime' => $meta['mime'],
                            'size' => $meta['size'],
                        ]);
                    }
                }
            }

            return $monitoring->load('documents', 'creator');
        });
    }
}
