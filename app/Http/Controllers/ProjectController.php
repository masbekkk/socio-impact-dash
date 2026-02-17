<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Division;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Project; // Keep only for type hinting in show/edit method signatures

final class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Projects/Index', [
            'filters' => $request->only(['search', 'status', 'division', 'start_date', 'end_date']),
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

    public function show(Project $project): Response
    {
        return Inertia::render('Projects/Show', [
            'project_slug' => $project->code, // Pass code for API fetch
        ]);
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('Projects/Edit', [
            'project_slug' => $project->code, // Pass code for API fetch
            'divisions' => Division::all(),
            'employees' => User::all(),
        ]);
    }
}
