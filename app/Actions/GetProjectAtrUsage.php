<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\AtrBudgetSelected;
use App\Models\Project;
use App\Models\Reimbursement;
use App\Models\ReimbursementItem;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\Relation;

final readonly class GetProjectAtrUsage
{
    /**
     * @return list<array{id: int, code: string, amount: float, requested_amount: float, converted: bool,
     *     allocation_pending: bool, allocations: array<int, float|null>, requested_allocations: array<int, float>}>
     */
    public function handle(Project $project): array
    {
        $atrs = Reimbursement::query()->where('project_id', $project->id)
            ->where('type', 'atr')
            ->whereNotIn('status', ['rejected', 'draft'])
            ->with([
                'items' => fn (Relation $query) => $query->whereNull('parent_item_id'),
                'atrBudgetSelecteds',
                'eers' => fn (Relation $query) => $query->where('type', 'eer')->whereNotIn('status', ['rejected', 'draft']),
            ])->get();

        $activityIds = $project->budgetDetails()->pluck('id')->all();
        $records = [];
        foreach ($atrs as $atr) {
            $requested = [];
            /** @var Collection<int, AtrBudgetSelected> $budgets */
            $budgets = $atr->atrBudgetSelecteds;
            foreach ($budgets as $budget) {
                $id = (int) $budget->project_budget_detail_id;
                $requested[$id] = ($requested[$id] ?? 0.0) + (float) $budget->amount;
            }

            // Item totals are the requested breakdown; selected budgets cover legacy ATRs without items.
            /** @var Collection<int, ReimbursementItem> $requestedItems */
            $requestedItems = $atr->items;
            foreach ($requestedItems->groupBy('project_budget_detail_id') as $id => $items) {
                $itemTotal = $items->sum('amount');
                $requested[(int) $id] = is_numeric($itemTotal) ? (float) $itemTotal : 0.0;
            }

            $amount = (float) ($atr->transferred_amount ?? $atr->amount);
            $requestedAmount = (float) array_sum($requested);
            $unallocated = $requested === [] || (count($requested) > 1 && round($amount * 100) !== round($requestedAmount * 100));
            $allocations = [];
            foreach ($requested as $id => $requestedForActivity) {
                // A single activity owns the entire transfer. A changed multi-activity transfer needs an explicit split.
                $allocations[$id] = $unallocated ? null : (count($requested) === 1 ? $amount : $requestedForActivity);
            }

            $records[] = [
                'id' => $atr->id,
                'code' => (string) $atr->code,
                'amount' => $amount,
                'requested_amount' => $requestedAmount,
                'converted' => $atr->eers->isNotEmpty(),
                'allocation_pending' => $unallocated || array_diff(array_keys($requested), $activityIds) !== [],
                'allocations' => $allocations,
                'requested_allocations' => $requested,
            ];
        }

        return $records;
    }
}
