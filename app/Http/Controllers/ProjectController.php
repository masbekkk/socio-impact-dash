<?php

declare(strict_types=1);

namespace App\Http\Controllers;

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
            'divisions' => \App\Models\Division::with('divisionCode')->get(),
        ]);
    }

    public function create(): Response
    {
        $totalManagementBudget = Project::where('project_type', '!=', 'non-project')->sum('management_budget');
        $usedNonProjectBudget = Project::where('project_type', 'non-project')->sum('budget_total');

        return Inertia::render('Projects/Create', [
            'divisions' => \App\Models\Division::with('divisionCode')->get(),
            'employees' => User::with('roles')->get(),
            'available_management_budget' => max(0, $totalManagementBudget - $usedNonProjectBudget),
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
        $totalManagementBudget = Project::where('project_type', '!=', 'non-project')->sum('management_budget');
        $usedNonProjectBudget = Project::where('project_type', 'non-project')->where('id', '!=', $project->id)->sum('budget_total');

        return Inertia::render('Projects/Edit', [
            'project_slug' => $project->uuid,
            'divisions' => \App\Models\Division::with('divisionCode')->get(),
            'employees' => User::with('roles')->get(),
            'available_management_budget' => max(0, $totalManagementBudget - $usedNonProjectBudget),
        ]);
    }
}
