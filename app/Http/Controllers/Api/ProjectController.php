<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Formatters\JsonResponseFormatter;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectListResource;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

final class ProjectController
{
    public function __construct(
        private ProjectService $projectService
    ) {}

    public function list(Request $request): JsonResponse
    {
        try {
            $filters = [
                'search' => $request->get('search'),
                'status' => $request->get('status'),
                'division_id' => $request->get('division_id'),
            ];

            $perPage = (int) $request->get('per_page', 15);
            $projects = $this->projectService->listProjects($filters, $perPage);

            return JsonResponseFormatter::success(
                ProjectListResource::collection($projects)
            );
        } catch (Throwable $th) {
            return JsonResponseFormatter::error(
                'Failed to fetch projects: '.$th->getMessage(),
                500
            );
        }
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        try {
            $userId = $request->user()?->id ?? 1;
            $project = $this->projectService->createProject(
                $request->validated(),
                $userId
            );

            return JsonResponseFormatter::created(
                $project,
                'Project created successfully'
            );
        } catch (Throwable $th) {
            return JsonResponseFormatter::error(
                'Failed to create project: '.$th->getMessage(),
                500
            );
        }
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        try {
            $userId = $request->user()?->id ?? 1;
            $updatedProject = $this->projectService->updateProject(
                $project,
                $request->validated(),
                $userId
            );

            return JsonResponseFormatter::success(
                $updatedProject,
                'Project updated successfully'
            );
        } catch (Throwable $th) {
            return JsonResponseFormatter::error(
                'Failed to update project: '.$th->getMessage(),
                500
            );
        }
    }

    public function destroy(Project $project): JsonResponse
    {
        try {
            $project->delete();

            return JsonResponseFormatter::success(
                null,
                'Project deleted successfully'
            );
        } catch (Throwable $th) {
            return JsonResponseFormatter::error(
                'Failed to delete project: '.$th->getMessage(),
                500
            );
        }
    }
}
