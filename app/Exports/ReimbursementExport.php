<?php

declare(strict_types=1);

namespace App\Exports;

use App\Exports\Sheets\AtrSheet;
use App\Exports\Sheets\EerSheet;
use App\Models\Reimbursement;
use App\Models\User;
use App\Services\ReimbursementService;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

final class ReimbursementExport implements WithMultipleSheets
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function __construct(
        private User $user,
        private array $filters = []
    ) {}

    /**
     * @return array<int, AtrSheet|EerSheet>
     */
    public function sheets(): array
    {
        $eagerLoads = [
            'user', 'project.division', 'approvals.approver',
            'atrBudgetSelecteds.budgetDetail', 'items.budgetDetail',
            'eers.approvals.approver', 'eers.items', 'eers.user', 'eers.project.division',
            'atr',
        ];

        // Build the base query using the same role-based filtering as ReimbursementService
        $query = Reimbursement::with($eagerLoads);

        // Apply Role-based filtering (same logic as ReimbursementService)
        if ($this->user->hasRole('superadmin') || $this->user->hasRole('finance') || $this->user->hasRole('direktur')) {
            // Can view all
        } elseif ($this->user->hasRole('hr')) {
            $query->where('type', \App\Enums\ReimbursementType::ALLOWANCE);
        } elseif ($this->user->hasRole('head')) {
            $query->where(function ($q) {
                $q->where('user_id', $this->user->id)
                    ->orWhereHas('user', fn ($uq) => $uq->where('head_id', $this->user->id))
                    ->orWhereHas('approvals', fn ($aq) => $aq->where('approver_id', $this->user->id));
            });
        } else {
            $query->where('user_id', $this->user->id);
        }

        // Apply filters
        if (! empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }

        if (! empty($this->filters['project_id'])) {
            $query->where('project_id', $this->filters['project_id']);
        }

        if (! empty($this->filters['division_id'])) {
            $query->whereHas('project', fn ($q) => $q->where('division_id', $this->filters['division_id']));
        }

        if (! empty($this->filters['start_date'])) {
            $query->whereDate('created_at', '>=', $this->filters['start_date']);
        }

        if (! empty($this->filters['end_date'])) {
            $query->whereDate('created_at', '<=', $this->filters['end_date']);
        }

        $all = $query->orderBy('created_at', 'desc')->get();

        $atrs = $all->where('type', \App\Enums\ReimbursementType::ATR)->values();
        $eers = $all->where('type', \App\Enums\ReimbursementType::EER)->values();

        return [
            new AtrSheet($atrs),
            new EerSheet($eers),
        ];
    }
}
