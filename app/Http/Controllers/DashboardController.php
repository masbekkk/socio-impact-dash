<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Division;
use App\Models\LetterRequest;
use App\Models\ProjectLocation;
use App\Models\ProjectYearClaim;
use App\Models\User;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $year = $request->integer('year');

        $availableYears = ProjectYearClaim::query()
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year');

        $totalUsers = User::query()->count();
        $totalDivisions = Division::query()->count();
        $totalLetterRequests = LetterRequest::query()->count();

        $leaderboardData = $this->getLeaderboardData($year);
        $totalBudget = Project::query()->sum('budget_total');
        $totalManagementBudget = Project::query()->sum('management_budget');

        $locations = ProjectLocation::with('project:id,name')->get();

        $projectsByDivision = Division::withCount('projects')->get()->map(fn (Division $d): array => [
            'division' => $d->name,
            'count' => $d->projects_count,
        ]);

        $user = $request->user();
        $roles = $user?->getRoleNames()->toArray() ?? [];
        $approvalItems = [
            'head_reimbursements' => [],
            'head_leaves' => [],
            'finance_reimbursements' => [],
            'direktur_reimbursements' => [],
            'direktur_leaves' => [],
            'hr_leaves' => [],
            'hr_allowances' => [],
            'finance_request_funds' => [],
        ];

        // Head Logic
        if (in_array('head', $roles)) {
            $approvalItems['head_reimbursements'] = \App\Http\Resources\V1\Reimbursement\ReimbursementResource::collection(
                \App\Models\Reimbursement::query()
                    ->whereHas('approvals', function ($q) use ($user): void {
                        $q->where('approver_id', $user->id)
                            ->where('status', \App\Enums\ApprovalStatus::Pending)
                            ->where('role', 'head');
                    })
                    ->whereIn('status', [\App\Enums\ReimbursementStatus::Submitted, \App\Enums\ReimbursementStatus::Revised])
                    ->with(['user', 'project.division', 'approvals.approver', 'atrBudgetSelecteds'])
                    ->get()
            )->resolve();

            $approvalItems['head_leaves'] = \App\Http\Resources\V1\Leave\LeaveResource::collection(
                \App\Models\Leave::query()
                    ->whereHas('approvals', function ($q) use ($user): void {
                        $q->where('approver_id', $user->id)
                            ->where('status', \App\Enums\ApprovalStatus::Pending)
                            ->where('role', 'head');
                    })
                    ->where('status', \App\Enums\LeaveStatus::Submitted)
                    ->with(['user', 'project', 'approvals.approver'])
                    ->get()
            )->resolve();
        }

        // Finance Logic
        if (in_array('finance', $roles)) {
            $approvalItems['finance_reimbursements'] = \App\Http\Resources\V1\Reimbursement\ReimbursementResource::collection(
                \App\Models\Reimbursement::query()
                    ->where('status', \App\Enums\ReimbursementStatus::HeadApproved)
                    ->with(['user', 'project.division', 'approvals.approver', 'atrBudgetSelecteds'])
                    ->get()
            )->resolve();

            $approvalItems['finance_request_funds'] = \App\Http\Resources\V1\Reimbursement\ReimbursementResource::collection(
                \App\Models\Reimbursement::query()
                    ->where('status', \App\Enums\ReimbursementStatus::Approved)
                    ->with(['user', 'project.division', 'approvals.approver', 'atrBudgetSelecteds'])
                    ->get()
            )->resolve();
        }

        // Direktur Logic
        if (in_array('direktur', $roles)) {
            $approvalItems['direktur_reimbursements'] = \App\Http\Resources\V1\Reimbursement\ReimbursementResource::collection(
                \App\Models\Reimbursement::query()
                    ->whereIn('status', [\App\Enums\ReimbursementStatus::FinanceApproved, \App\Enums\ReimbursementStatus::HRApproved])
                    ->with(['user', 'project.division', 'approvals.approver', 'atrBudgetSelecteds'])
                    ->get()
            )->resolve();

            $approvalItems['direktur_leaves'] = \App\Http\Resources\V1\Leave\LeaveResource::collection(
                \App\Models\Leave::query()
                    ->where('status', \App\Enums\LeaveStatus::HeadApproved)
                    ->with(['user', 'project', 'approvals.approver'])
                    ->get()
            )->resolve();
        }

        // HR Logic
        if (in_array('hr', $roles)) {
            $approvalItems['hr_allowances'] = \App\Http\Resources\V1\Reimbursement\ReimbursementResource::collection(
                \App\Models\Reimbursement::query()
                    ->where('status', \App\Enums\ReimbursementStatus::HeadApproved)
                    ->where('type', \App\Enums\ReimbursementType::ALLOWANCE)
                    ->with(['user', 'project.division', 'approvals.approver', 'atrBudgetSelecteds'])
                    ->get()
            )->resolve();

            $approvalItems['hr_leaves'] = \App\Http\Resources\V1\Leave\LeaveResource::collection(
                \App\Models\Leave::query()
                    ->where('status', \App\Enums\LeaveStatus::DirekturApproved)
                    ->with(['user', 'project', 'approvals.approver'])
                    ->get()
            )->resolve();
        }

        return Inertia::render('Dashboard/Index', [
            'totalUsers' => $totalUsers,
            'totalDivisions' => $totalDivisions,
            'totalLetterRequests' => $totalLetterRequests,
            'totalYearClaims' => $leaderboardData['totalYearClaims'],
            'accountManagerLeaderboard' => $leaderboardData['accountManagerLeaderboard'],
            'divisionLeaderboard' => $leaderboardData['divisionLeaderboard'],
            'locations' => $locations,
            'projectsByDivision' => $projectsByDivision,
            'approvalItems' => $approvalItems,
            'availableYears' => $availableYears,
            'selectedYear' => $year ?: null,
            'totalBudget' => $totalBudget,
            'totalManagementBudget' => $totalManagementBudget,
        ]);
    }

    public function leaderboard(Request $request): JsonResponse
    {
        $year = $request->integer('year');

        $data = $this->getLeaderboardData($year);

        return response()->json($data);
    }

    private function getLeaderboardData(?int $year): array
    {
        $totalYearClaims = ProjectYearClaim::query()
            ->when($year, fn ($q) => $q->where('year', $year))
            ->sum('amount');

        $accountManagerLeaderboard = DB::table('project_year_claims as pyc')
            ->join('projects', 'pyc.project_id', '=', 'projects.id')
            ->selectRaw('projects.account_manager_id, SUM(pyc.amount) as total_budget')
            ->where('projects.project_type', '!=', 'non-project')
            ->when($year, fn ($q) => $q->where('pyc.year', $year))
            ->groupBy('projects.account_manager_id')
            ->orderByDesc('total_budget')
            ->take(10)
            ->get();

        $amIds = $accountManagerLeaderboard->pluck('account_manager_id');
        $amNames = User::whereIn('id', $amIds)->get()->keyBy('id');

        $accountManagerLeaderboard = $accountManagerLeaderboard->map(fn ($item) => [
            'name' => $amNames[$item->account_manager_id]?->name ?? 'Unknown',
            'total_budget' => (float) $item->total_budget,
        ]);

        $divisionLeaderboard = DB::table('project_year_claims as pyc')
            ->join('projects', 'pyc.project_id', '=', 'projects.id')
            ->join('divisions', 'projects.division_id', '=', 'divisions.id')
            ->selectRaw('divisions.name as division, SUM(pyc.amount) as total_budget')
            ->where('projects.project_type', '!=', 'non-project')
            ->when($year, fn ($q) => $q->where('pyc.year', $year))
            ->groupBy('projects.division_id', 'divisions.name')
            ->orderByDesc('total_budget')
            ->take(10)
            ->get()
            ->map(fn ($item) => [
                'division' => $item->division,
                'total_budget' => (float) $item->total_budget,
            ]);

        return [
            'totalYearClaims' => (float) $totalYearClaims,
            'accountManagerLeaderboard' => $accountManagerLeaderboard,
            'divisionLeaderboard' => $divisionLeaderboard,
        ];
    }
}
