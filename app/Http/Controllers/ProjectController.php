<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\DivisionCode;
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
        return Inertia::render('Projects/Index', [
            'filters' => $request->only(['search', 'status', 'division', 'start_date', 'end_date']),
            'divisions' => DivisionCode::with('divisions')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Projects/Create', [
            'divisions' => DivisionCode::with('divisions')->get(),
            'employees' => User::all(),
        ]);
    }

    public function show(Project $project): Response
    {

        return Inertia::render('Projects/Show', [
            'project_slug' => $project->uuid,
        ]);
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('Projects/Edit', [
            'project_slug' => $project->uuid,
            'divisions' => DivisionCode::with('divisions')->get(),
            'employees' => User::all(),
        ]);
    }
}
