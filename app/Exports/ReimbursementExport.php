<?php

declare(strict_types=1);

namespace App\Exports;

use App\Exports\Sheets\AtrSheet;
use App\Exports\Sheets\EerSheet;
use App\Models\Reimbursement;
use App\Models\User;
use App\Services\ReimbursementService;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

final readonly class ReimbursementExport implements WithMultipleSheets
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

        $service = new ReimbursementService();
        $service->applyFilters($query, $this->user, $this->filters);

        $all = $query->latest()->get();

        $atrs = $all->where('type', \App\Enums\ReimbursementType::ATR)->values();
        $eers = $all->where('type', \App\Enums\ReimbursementType::EER)->values();

        return [
            new AtrSheet($atrs),
            new EerSheet($eers),
        ];
    }
}
