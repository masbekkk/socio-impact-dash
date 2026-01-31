<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;

final class ProjectController
{
    /**
     * Display a listing of the resource.
     */
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
        $divisions = \App\Models\Division::all();

        return \Inertia\Inertia::render('Projects/Create', [
            'divisions' => $divisions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        //
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
    public function edit($slug)
    {
        // Dummy Data for Edit Form as requested
        $project = [
            'name' => 'Pendampingan UMKM Jahe Merah',
            'slug' => 'pendampingan-umkm-jahe-merah',
            'code' => 'PRJ-2025-001',
            'client' => 'PT Sinergi Alam',
            'type' => 'pendampingan',
            'division_code' => '1',
            'status' => 'active',
            'sow' => "Melakukan pendampingan intensif kepada 50 petani jahe merah...",
            'start_date' => '2025-01-10',
            'end_date' => '2025-06-10',
            'budget_total' => 150000000,
            'team' => [
                'am' => 'Budi Santoso',
                'head' => 'Siti Aminah',
                'pic' => 'Rudi Hermawan'
            ],
            'issues' => [],
            'monitoring_history' => []
        ];

        // Dummy Divisions
        $divisions = [
            ['id' => 1, 'name' => 'Divisi Operasional'],
            ['id' => 2, 'name' => 'Divisi IT'],
            ['id' => 3, 'name' => 'Divisi Keuangan'],
            ['id' => 4, 'name' => 'Divisi SDM'],
        ];

        return \Inertia\Inertia::render('Projects/Edit', [
            'project' => $project,
            'divisions' => $divisions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }
}
