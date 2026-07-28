<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Division;
use App\Models\LetterRequest;
use App\Models\Project;
use App\Models\ProjectLocation;
use App\Models\ProjectYearClaim;
use App\Models\User;
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
        // $totalBudget = Project::query()->sum('budget_total');
        // $totalManagementBudget = Project::query()->sum('management_budget');

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
            // 'totalBudget' => $totalBudget,
            // 'totalManagementBudget' => $totalManagementBudget,
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
            ->get();

        $amIds = $accountManagerLeaderboard->pluck('account_manager_id')->filter()->toArray();

        $eerExpensesQuery = DB::table('reimbursements as r')
            ->join('projects as p', 'r.project_id', '=', 'p.id')
            ->join('project_year_claims as pyc', 'p.id', '=', 'pyc.project_id')
            ->selectRaw('p.account_manager_id, SUM(r.amount) as total')
            ->where('r.type', 'eer')
            ->whereNull('r.deleted_at')
            ->whereNotIn('r.status', ['draft', 'rejected'])
            ->whereIn('p.account_manager_id', $amIds);
        if ($year) {
            $eerExpensesQuery->where('pyc.year', $year);
        }
        $eerExpenses = $eerExpensesQuery->groupBy('p.account_manager_id')
            ->pluck('total', 'account_manager_id');

        $allowanceExpensesQuery = DB::table('reimbursements as r')
            ->join('projects as p', 'r.project_id', '=', 'p.id')
            ->join('project_year_claims as pyc', 'p.id', '=', 'pyc.project_id')
            ->selectRaw('p.account_manager_id, SUM(r.amount) as total')
            ->where('r.type', 'allowance')
            ->whereNull('r.deleted_at')
            ->whereNotIn('r.status', ['draft', 'rejected'])
            ->whereIn('p.account_manager_id', $amIds);
        if ($year) {
            $allowanceExpensesQuery->where('pyc.year', $year);
        }
        $allowanceExpenses = $allowanceExpensesQuery->groupBy('p.account_manager_id')
            ->pluck('total', 'account_manager_id');

        $atrExpensesQuery = DB::table('reimbursements as r')
            ->join('projects as p', 'r.project_id', '=', 'p.id')
            ->join('project_year_claims as pyc', 'p.id', '=', 'pyc.project_id')
            ->selectRaw('p.account_manager_id, SUM(r.amount) as total')
            ->where('r.type', 'atr')
            ->whereNull('r.deleted_at')
            ->whereNotIn('r.status', ['draft', 'rejected'])
            ->whereIn('p.account_manager_id', $amIds)
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('reimbursements as eer')
                    ->whereColumn('eer.atr_id', 'r.id')
                    ->where('eer.type', 'eer')
                    ->whereNull('eer.deleted_at')
                    ->whereNotIn('eer.status', ['draft', 'rejected']);
            });
        if ($year) {
            $atrExpensesQuery->where('pyc.year', $year);
        }
        $atrExpenses = $atrExpensesQuery->groupBy('p.account_manager_id')
            ->pluck('total', 'account_manager_id');

        $userKpisQuery = DB::table('user_kpis')
            ->selectRaw('user_id, SUM(nominal) as total_kpi')
            ->whereIn('user_id', $amIds);
        if ($year) {
            $userKpisQuery->where('year', $year);
        }
        $userKpis = $userKpisQuery->groupBy('user_id')->pluck('total_kpi', 'user_id');

        $amNames = User::whereIn('id', $amIds)->get()->keyBy('id');

        $accountManagerLeaderboard = $accountManagerLeaderboard->map(function ($item) use ($amNames, $eerExpenses, $allowanceExpenses, $atrExpenses, $userKpis) {
            $amId = $item->account_manager_id;
            $budget = (float) $item->total_budget;
            $eer = (float) ($eerExpenses[$amId] ?? 0);
            $allowance = (float) ($allowanceExpenses[$amId] ?? 0);
            $atr = (float) ($atrExpenses[$amId] ?? 0);
            $totalExpenses = $eer + $allowance + $atr;
            $profit = $budget - $totalExpenses;
            $kpiNominal = (float) ($userKpis[$amId] ?? 0);

            $utilization = 0;
            if ($kpiNominal > 0) {
                $utilization = ($budget / $kpiNominal) * 100;
                $utilization = max(0, min(100, $utilization));
            } elseif ($budget > 0) {
                $utilization = ($totalExpenses / $budget) * 100;
                $utilization = max(0, min(100, $utilization));
            }

            return [
                'id' => $amId,
                'name' => $amNames[$amId]?->name ?? 'Unknown',
                'kpi_nominal' => $kpiNominal,
                'total_budget' => $budget,
                'atr_expenses' => $atr,
                'eer_expenses' => $eer,
                'allowance_expenses' => $allowance,
                'total_expenses' => $totalExpenses,
                'profit' => $profit,
                'utilization_percentage' => $utilization,
            ];
        });

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

        $globalManagementBudgetQuery = DB::table('project_year_claims as pyc')
            ->join('projects as p', 'pyc.project_id', '=', 'p.id')
            ->selectRaw('SUM((pyc.amount / p.budget_total) * p.management_budget) as total_management_budget')
            ->where('p.project_type', '!=', 'non-project')
            ->where('p.budget_total', '>', 0);

        if ($year) {
            $globalManagementBudgetQuery->where('pyc.year', $year);
        }

        $globalManagementBudget = (float) $globalManagementBudgetQuery->value('total_management_budget');

        $globalBudget = (float) $totalYearClaims;
        $globalEer = $eerExpenses->sum();
        $globalAllowance = $allowanceExpenses->sum();
        $globalAtr = $atrExpenses->sum();
        $globalTotalExpenses = $globalEer + $globalAllowance + $globalAtr;
        $globalProfit = $globalBudget - $globalTotalExpenses - $globalManagementBudget;

        $yearlySummary = [
            'year' => $year ?? 'all',
            'total_budget' => $globalBudget,
            'atr_expenses' => (float) $globalAtr,
            'eer_expenses' => (float) $globalEer,
            'allowance_expenses' => (float) $globalAllowance,
            'total_management_budget' => $globalManagementBudget,
            'total_expenses' => (float) $globalTotalExpenses,
            'remaining_profit' => (float) $globalProfit,
            'utilization_percentage' => $globalBudget > 0 ? min(100, (($globalTotalExpenses + $globalManagementBudget) / $globalBudget) * 100) : 0,
            'remaining_percentage' => $globalBudget > 0 ? ($globalProfit / $globalBudget) * 100 : 0,
        ];

        return [
            'totalYearClaims' => (float) $totalYearClaims,
            'yearlySummary' => $yearlySummary,
            'accountManagerLeaderboard' => $accountManagerLeaderboard,
            'divisionLeaderboard' => $divisionLeaderboard,
        ];
    }
}
