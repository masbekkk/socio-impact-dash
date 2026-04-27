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
        $totalUsers = User::query()->count();
        $totalDivisions = Division::query()->count();
        $totalLetterRequests = LetterRequest::query()->count();
        $totalBudget = Project::query()->sum('budget_total');
        $totalManagementBudget = Project::query()->sum('management_budget');

        $leaderboard = Project::query()->selectRaw('created_by, SUM(budget_total) as total_budget')
            ->groupBy('created_by')
            ->orderByDesc('total_budget')
            ->with('creator:id,name')
            ->take(10)
            ->get();

        $locations = ProjectLocation::with('project:id,name')->get();

        $projectsByDivision = Division::query()->withCount('projects')->get()->map(fn (Division $d): array => [
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
                    ->where('status', \App\Enums\ReimbursementStatus::Submitted)
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
            $approvalItems['hr_reimbursements'] = \App\Http\Resources\V1\Reimbursement\ReimbursementResource::collection(
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
            'totalBudget' => (float) $totalBudget,
            'totalManagementBudget' => (float) $totalManagementBudget,
            'leaderboard' => $leaderboard,
            'locations' => $locations,
            'projectsByDivision' => $projectsByDivision,
            'approvalItems' => $approvalItems,
        ]);
    }
}
