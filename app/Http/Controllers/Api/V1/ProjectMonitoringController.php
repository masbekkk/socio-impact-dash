<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Actions\Projects\StoreProjectMonitoring;
use App\Formatters\JsonResponseFormatter;
use App\Http\Resources\V1\Project\ProjectMonitoringResource;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

final class ProjectMonitoringController extends Controller
{
    public function store(Request $request, Project $project, StoreProjectMonitoring $storeMonitoring): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'report_date' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'documents' => ['nullable', 'array'],
            'documents.*.title' => ['nullable', 'string', 'max:255'],
            'documents.*.file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:51200'], // 50MB limit
        ]);

        $monitoring = $storeMonitoring->handle($project, $validated, $request->user()->id);

        $monitoring->load(['creator', 'documents']);

        return JsonResponseFormatter::success(
            new ProjectMonitoringResource($monitoring),
            'Monitoring report submitted successfully',
            201
        );
    }

    public function destroy(Project $project, \App\Models\ProjectMonitoring $monitoring): \Illuminate\Http\JsonResponse
    {
        // Check if monitoring belongs to project
        if ($monitoring->project_id !== $project->id) {
            return JsonResponseFormatter::error('Monitoring report not found for this project', 404);
        }

        // Optional: Check permissions (e.g., only creator or admin can delete)
        // For now, allow any authenticated user with project access

        \Illuminate\Support\Facades\DB::transaction(function () use ($monitoring): void {
            // Delete associated files
            $fileUploadService = resolve(\App\Services\FileUploadService::class);
            foreach ($monitoring->documents as $document) {
                $fileUploadService->deleteFile($document->path);
            }

            $monitoring->delete();
        });

        return JsonResponseFormatter::success(null, 'Monitoring report deleted successfully');
    }
}
