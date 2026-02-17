<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Actions\Projects\CreateProject;
use App\Actions\Projects\DeleteProject;
use App\Actions\Projects\UpdateProject;
use App\Formatters\JsonResponseFormatter;
use App\Http\Requests\Projects\StoreProjectRequest;
use App\Http\Requests\Projects\UpdateProjectRequest;
use App\Http\Resources\V1\Project\ProjectCollection;
use App\Http\Resources\V1\Project\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

final class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Project::with(['division', 'accountManager', 'head', 'pic']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('client', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $projects = $query->latest()->paginate($request->get('per_page', 10));

        return JsonResponseFormatter::success(
            new ProjectCollection($projects),
            'Projects retrieved successfully'
        );
    }

    public function store(StoreProjectRequest $request, CreateProject $createProject): JsonResponse
    {
        $project = $createProject->handle($request->validated(), $request->user()->id);

        return JsonResponseFormatter::success(
            new ProjectResource($project),
            'Project created successfully',
            201
        );
    }

    public function show(Project $project): JsonResponse
    {
        $project->load(['division', 'accountManager', 'head', 'pic', 'locations', 'budgets', 'milestones', 'documents']);

        return JsonResponseFormatter::success(
            new ProjectResource($project),
            'Project retrieved successfully'
        );
    }

    public function update(UpdateProjectRequest $request, Project $project, UpdateProject $updateProject): JsonResponse
    {
        $project = $updateProject->handle($project, $request->validated(), $request->user()->id);

        return JsonResponseFormatter::success(
            new ProjectResource($project),
            'Project updated successfully'
        );
    }

    public function destroy(Project $project, DeleteProject $deleteProject): JsonResponse
    {
        $deleteProject->handle($project);

        return JsonResponseFormatter::success(
            null,
            'Project deleted successfully'
        );
    }
}
