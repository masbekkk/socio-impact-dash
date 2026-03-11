<?php

declare(strict_types=1);

namespace App\Actions\Projects;

use App\Models\Project;
use App\Models\ProjectMonitoring;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

final class StoreProjectMonitoring
{
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
                        $file = $doc['file'];

                        // Save to temp local disk
                        $tempPath = $file->store("temp/projects/{$project->id}/monitorings/{$monitoring->id}", 'local');

                        // Create doc record with pending
                        $document = $monitoring->documents()->create([
                            'title' => $doc['title'] ?? null,
                            'original_name' => $file->getClientOriginalName(),
                            'path' => '', // Set by job
                            'mime' => $file->getClientMimeType(),
                            'size' => $file->getSize(),
                            'upload_status' => 'pending',
                            'temp_path' => $tempPath,
                        ]);

                        // Dispatch background job
                        dispatch(new \App\Jobs\ProcessProjectMonitoringDocumentUpload($document->id, "projects/{$project->id}/monitorings/{$monitoring->id}"));
                    }
                }
            }

            return $monitoring->load('documents', 'creator');
        });
    }
}
