<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Project;
use Illuminate\Database\Eloquent\Builder;

final readonly class GetManagementBudgetOverview
{
    /**
     * @return array{
     *     total_management_budget: float, allocated_budget: float, available_budget: float,
     *     overallocated_budget: float, total_expenses: float,
     *     projects: list<array{uuid: string, code: string|null, name: string, budget_total: float,
     *         pending_atr: float, used_eer: float, used_allowance: float, remaining_budget: float}>
     * }
     */
    public function handle(): array
    {
        $totalManagementBudget = (float) Project::query()
            ->where('project_type', '!=', 'non-project')
            ->sum('management_budget');

        $projects = Project::query()
            ->select(['id', 'uuid', 'code', 'name', 'budget_total'])
            ->where('project_type', 'non-project')
            ->withSum(['reimbursements as pending_atr' => function (Builder $query): void {
                $query->where('type', 'atr')
                    ->whereNotIn('status', ['draft', 'rejected'])
                    ->whereDoesntHave('eers', function (Builder $eer): void {
                        $eer->where('type', 'eer')->whereNotIn('status', ['draft', 'rejected']);
                    });
            }], 'amount')
            ->withSum(['reimbursements as used_eer' => function (Builder $query): void {
                $query->where('type', 'eer')->whereNotIn('status', ['draft', 'rejected']);
            }], 'amount')
            ->withSum(['reimbursements as used_allowance' => function (Builder $query): void {
                $query->where('type', 'allowance')->whereNotIn('status', ['draft', 'rejected', 'revision']);
            }], 'amount')
            ->orderByDesc('budget_total')
            ->orderBy('name')
            ->get()
            ->map(function (Project $project): array {
                $budget = (float) $project->budget_total;
                $atrAmount = $project->getAttribute('pending_atr');
                $eerAmount = $project->getAttribute('used_eer');
                $allowanceAmount = $project->getAttribute('used_allowance');
                $atr = is_numeric($atrAmount) ? (float) $atrAmount : 0.0;
                $eer = is_numeric($eerAmount) ? (float) $eerAmount : 0.0;
                $allowance = is_numeric($allowanceAmount) ? (float) $allowanceAmount : 0.0;

                return [
                    'uuid' => $project->uuid,
                    'code' => $project->code,
                    'name' => $project->name,
                    'budget_total' => $budget,
                    'pending_atr' => $atr,
                    'used_eer' => $eer,
                    'used_allowance' => $allowance,
                    'remaining_budget' => $budget - $atr - $eer - $allowance,
                ];
            })->all();

        $allocatedBudget = (float) array_sum(array_column($projects, 'budget_total'));

        return [
            'total_management_budget' => $totalManagementBudget,
            'allocated_budget' => $allocatedBudget,
            'available_budget' => max(0.0, $totalManagementBudget - $allocatedBudget),
            'overallocated_budget' => max(0.0, $allocatedBudget - $totalManagementBudget),
            'total_expenses' => (float) (array_sum(array_column($projects, 'pending_atr')) + array_sum(array_column($projects, 'used_eer')) + array_sum(array_column($projects, 'used_allowance'))),
            'projects' => array_values($projects),
        ];
    }
}
