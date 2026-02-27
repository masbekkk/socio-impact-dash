<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Actions\Projects\ApproveProject;
use App\Actions\Projects\RejectProject;
use App\Formatters\JsonResponseFormatter;
use App\Http\Resources\V1\Project\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

final class ProjectApprovalController extends Controller
{
    public function approve(Request $request, Project $project, ApproveProject $approveProject): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $project = $approveProject->handle($project, $request->user()->id, $validated['notes'] ?? null);

        return JsonResponseFormatter::success(
            new ProjectResource($project),
            'Project approved successfully'
        );
    }

    public function reject(Request $request, Project $project, RejectProject $rejectProject): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'notes' => ['required', 'string', 'max:1000'],
        ]);

        $project = $rejectProject->handle($project, $request->user()->id, $validated['notes']);

        return JsonResponseFormatter::success(
            new ProjectResource($project),
            'Project rejected (requested for revision) successfully'
        );
    }
}
