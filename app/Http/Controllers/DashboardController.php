<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Division;
use App\Models\LetterRequest;
use App\Models\Project;
use App\Models\ProjectLocation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $totalUsers = User::count();
        $totalDivisions = Division::count();
        $totalLetterRequests = LetterRequest::count();
        $totalBudget = Project::sum('budget_total');
        $totalManagementBudget = Project::sum('management_budget');

        $leaderboard = Project::selectRaw('created_by, SUM(budget_total) as total_budget')
            ->groupBy('created_by')
            ->orderByDesc('total_budget')
            ->with('creator:id,name')
            ->take(10)
            ->get();

        $locations = ProjectLocation::with('project:id,name')->get();

        $projectsByDivision = Division::withCount('projects')->get()->map(fn (Division $d): array => [
            'division' => $d->name,
            'count' => $d->projects_count,
        ]);

        return Inertia::render('Dashboard/Index', [
            'totalUsers' => $totalUsers,
            'totalDivisions' => $totalDivisions,
            'totalLetterRequests' => $totalLetterRequests,
            'totalBudget' => (float) $totalBudget,
            'totalManagementBudget' => (float) $totalManagementBudget,
            'leaderboard' => $leaderboard,
            'locations' => $locations,
            'projectsByDivision' => $projectsByDivision,
        ]);
    }
}
