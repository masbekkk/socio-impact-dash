<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Division;
use App\Models\Project;
use App\Models\ProjectCategoryBudget;
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
        // LOAD DATA FROM JSON (Dummy Source)
        $jsonPath = database_path('data/projects.json');
        if (file_exists($jsonPath)) {
            $jsonContent = file_get_contents($jsonPath);
            $mockProjects = json_decode($jsonContent, true);
        } else {
            $mockProjects = []; // Fallback empty
        }

        // --- Helper for Mock Data Flexibility (Adding fields if missing in JSON for older entries) ---
        $mockProjects = array_map(function ($p) {
            // Ensure basic fields exist for display
            $p['division'] = ['name' => $p['division_name'] ?? ($p['division_code'] ?? 'General')];
            $p['pic'] = ['name' => $p['team']['pic'] ?? 'Unassigned'];
            $p['account_manager'] = ['name' => $p['team']['am'] ?? 'Unassigned'];
            return $p;
        }, $mockProjects);


        $search = request()->get('search');
        $status = request()->get('status');
        $division = request()->get('division');
        $page = (int) request()->get('page', 1);
        $perPage = (int) request()->get('per_page', 10);

        // Filter data
        if ($search) {
            $mockProjects = array_filter($mockProjects, function ($project) use ($search) {
                return stripos($project['name'], $search) !== false ||
                    stripos($project['code'], $search) !== false ||
                    stripos($project['client'], $search) !== false;
            });
        }

        if ($status && $status !== 'all') {
            $mockProjects = array_filter($mockProjects, function ($project) use ($status) {
                return $project['status'] === $status;
            });
        }

        if ($division && $division !== 'all') {
            $mockProjects = array_filter($mockProjects, function ($project) use ($division) {
                // Check against division name or code
                $divName = $project['division']['name'] ?? '';
                $divCode = $project['division_code'] ?? '';
                return stripos($divName, $division) !== false || stripos($divCode, $division) !== false;
            });
        }

        $total = count($mockProjects);
        $lastPage = ceil($total / $perPage);
        $page = $page > $lastPage && $lastPage > 0 ? $lastPage : $page;

        $offset = ($page - 1) * $perPage;
        $slicedData = array_slice($mockProjects, $offset, $perPage);

        // Helper to build URL with query params
        $buildUrl = function ($pageNum) use ($perPage, $search, $status, $division) {
            $queryParams = [
                'page' => $pageNum,
                'per_page' => $perPage,
            ];
            if ($search)
                $queryParams['search'] = $search;
            if ($status)
                $queryParams['status'] = $status;
            if ($division)
                $queryParams['division'] = $division;

            return '/projects?' . http_build_query($queryParams);
        };

        $projects = [
            'data' => $slicedData,
            'current_page' => (int) $page,
            'first_page_url' => $buildUrl(1),
            'from' => $total > 0 ? $offset + 1 : 0,
            'last_page' => $lastPage,
            'last_page_url' => $buildUrl($lastPage),
            'links' => [],
            'next_page_url' => $page < $lastPage ? $buildUrl($page + 1) : null,
            'path' => '/projects',
            'per_page' => (int) $perPage,
            'prev_page_url' => $page > 1 ? $buildUrl($page - 1) : null,
            'to' => min($offset + $perPage, $total),
            'total' => $total,
        ];

        return \Inertia\Inertia::render('Projects/Index', [
            'projects' => $projects,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'division' => $division
            ],
            'divisions' => \App\Models\Division::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {   
        $divisions = Division::orderBy('name', 'asc')->get();
        $users = User::orderBy('name', 'asc')->get();
        $budgetCategories = ProjectCategoryBudget::orderBy('name', 'asc')->get();
        
        return view('create_project', [
            'divisions' => $divisions, 
            'users' => $users,
            'budgetCategories' => $budgetCategories,
        ]);
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
    public function show($slug)
    {
        // LOAD DATA FROM JSON
        $jsonPath = database_path('data/projects.json');
        if (!file_exists($jsonPath)) {
            abort(404, 'Project data not found.');
        }

        $projects = json_decode(file_get_contents($jsonPath), true);

        // Find project by slug
        $project = null;
        foreach ($projects as $p) {
            if (($p['slug'] ?? '') === $slug) {
                $project = $p;
                break;
            }
        }

        if (!$project) {
            abort(404, 'Project not found.');
        }

        // Enrich with defaults if missing
        $project['team'] = $project['team'] ?? ['am' => '-', 'head' => '-', 'pic' => '-'];
        $project['issues'] = $project['issues'] ?? [];
        $project['monitoring_history'] = $project['monitoring_history'] ?? [];

        return \Inertia\Inertia::render('Projects/Show', [
            'project' => $project
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        $project->load(['locations', 'documents', 'budgets', 'budgets.category', 'budgets.logs', 'milestones', 'issues']);
        $divisions = Division::orderBy('name', 'asc')->get();
        $users = User::orderBy('name', 'asc')->get();
        $budgetCategories = ProjectCategoryBudget::orderBy('name', 'asc')->get();
        
        return view('update_project', [
            'project' => $project,
            'divisions' => $divisions,
            'users' => $users,
            'budgetCategories' => $budgetCategories,
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
