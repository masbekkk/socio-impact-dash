<?php

declare(strict_types=1);

namespace App\Http\Controllers;

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
        return Inertia::render('Projects/Index', [
            'filters' => $request->only(['search', 'status', 'division', 'start_date', 'end_date']),
            'divisions' => Division::all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Projects/Create', [
            'divisions' => Division::all(),
            'finance_users' => User::role(\App\Enums\UserRole::Finance->value)->get(),
            'hr_users' => User::role(\App\Enums\UserRole::HR->value)->get(),
            'director_users' => User::role(\App\Enums\UserRole::Direktur->value)->get(),
        ]);
    }

    public function show(Project $project): Response
    {

        return Inertia::render('Projects/Show', [
            'project_slug' => $project->id,
        ]);
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('Projects/Edit', [
            'project_slug' => $project->id,
            'divisions' => Division::all(),
            'finance_users' => User::role(\App\Enums\UserRole::Finance->value)->get(),
            'hr_users' => User::role(\App\Enums\UserRole::HR->value)->get(),
            'director_users' => User::role(\App\Enums\UserRole::Direktur->value)->get(),
        ]);
    }
}
