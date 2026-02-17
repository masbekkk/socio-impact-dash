<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Actions\Projects\CreateProject;
use App\Actions\Projects\DeleteProject;
use App\Actions\Projects\UpdateProject;
use App\Formatters\JsonResponseFormatter;
use App\Http\Resources\V1\Project\ProjectCollection;
use App\Http\Resources\V1\Project\ProjectResource;
use App\Http\Requests\Projects\StoreProjectRequest;
use App\Http\Requests\Projects\UpdateProjectRequest;
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
            $search = (string) $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('division') && $request->division !== 'all') {
            $query->whereHas('division', function ($q) use ($request) {
                $q->where('name', $request->division);
            });
        }

        if ($request->filled('start_date')) {
            $query->whereDate('start_date', '>=', (string) $request->get('start_date'));
        }

        if ($request->filled('end_date')) {
            $query->whereDate('end_date', '<=', (string) $request->get('end_date'));
        }

        $perPage = $request->integer('per_page', 10);
        $projects = $query->latest()->paginate($perPage);

        return JsonResponseFormatter::success(
            new ProjectCollection($projects),
            'Projects retrieved successfully'
        );
    }

    public function store(StoreProjectRequest $request, CreateProject $createProject): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $project = $createProject->handle($request->validated(), $user->id);

        return JsonResponseFormatter::success(
            new ProjectResource($project),
            'Project created successfully',
            201
        );
    }

    public function show(Project $project): JsonResponse
    {
        $project->load(['division', 'accountManager', 'head', 'pic', 'locations', 'terminPayments', 'documents']);

        return JsonResponseFormatter::success(
            new ProjectResource($project),
            'Project retrieved successfully'
        );
    }

    public function update(UpdateProjectRequest $request, Project $project, UpdateProject $updateProject): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $project = $updateProject->handle($project, $request->validated(), $user->id);

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

    public function deal(Project $project, UpdateProject $updateProject): JsonResponse
    {
        /** @var int $userId */
        $userId = auth()->id();
        $project = $updateProject->handle($project, ['status' => 'active'], $userId);

        return JsonResponseFormatter::success(
            new ProjectResource($project),
            'Project marked as Dealed successfully'
        );
    }
}
