<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Projects\CreateProject;
use App\Actions\Projects\DeleteProject;
use App\Actions\Projects\UpdateProject;
use App\Http\Requests\Projects\StoreProjectRequest;
use App\Http\Requests\Projects\UpdateProjectRequest;
use App\Http\Resources\V1\Project\ProjectResource;
use App\Models\Division;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

final class ProjectController extends Controller
{
    public function index(Request $request): Response
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

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $projects = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'filters' => $request->only(['search', 'status']),
            'divisions' => Division::all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Projects/Create', [
            'divisions' => Division::all(),
            'employees' => User::all(),
        ]);
    }

    public function store(StoreProjectRequest $request, CreateProject $createProject)
    {
        $project = $createProject->handle($request->validated(), $request->user()->id);

        return redirect()->route('projects.show', $project->id)
            ->with('success', 'Project created successfully.');
    }

    public function show(Project $project): Response
    {
        $project->load(['division', 'accountManager', 'head', 'pic', 'locations', 'budgets', 'milestones', 'documents']);

        return Inertia::render('Projects/Show', [
            'project' => new ProjectResource($project),
        ]);
    }

    public function edit(Project $project): Response
    {
        $project->load(['division', 'accountManager', 'head', 'pic', 'locations', 'budgets', 'milestones', 'documents']);

        return Inertia::render('Projects/Edit', [
            'project' => new ProjectResource($project),
            'divisions' => Division::all(),
            'employees' => User::all(),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project, UpdateProject $updateProject)
    {
        $updateProject->handle($project, $request->validated(), $request->user()->id);

        return redirect()->route('projects.show', $project->id)
            ->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project, DeleteProject $deleteProject)
    {
        $deleteProject->handle($project);

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}
