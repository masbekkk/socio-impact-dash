<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Division;
use App\Models\Project;
use App\Models\User;
use App\Services\ProjectService;
use Illuminate\Support\Facades\Auth;

final class ProjectController
{
    protected $projectService; 

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {   
        $divisions = Division::orderBy('name', 'asc')->get();
        $users = User::orderBy('name', 'asc')->get();
        return view('create_project', ['divisions' => $divisions, 'users' => $users]);
    }


    public function store(StoreProjectRequest $request)
    {   
        try {
        $userId = Auth::id();
        $project = $this->projectService->createProject($request->validated(), $userId);
        return response()->json([
            'success' => true,
            'message' => 'Project created successfully',
            'data' => $project
        ]);
        } catch (\Throwable $th) {
            return response()->json([ 
                'success' => false,
                'message' => 'Failed to create project',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        $project->load(['locations', 'documents', 'budgets', 'milestones', 'issues']);
        $divisions = Division::orderBy('name', 'asc')->get();
        $users = User::orderBy('name', 'asc')->get();
        
        return view('update_project', [
            'project' => $project,
            'divisions' => $divisions,
            'users' => $users
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        try {
            $userId = Auth::id();
            $updatedProject = $this->projectService->updateProject($project, $request->validated(), $userId);
            return response()->json([
                'success' => true,
                'message' => 'Project updated successfully',
                'data' => $updatedProject
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update project',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }
}
