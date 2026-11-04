<?php

declare(strict_types=1);

namespace App\Exports;

use App\Enums\ReimbursementType;
use App\Exports\Sheets\AllowanceSheet;
use App\Exports\Sheets\AtrSheet;
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
     * @return array<int, AtrSheet|AllowanceSheet>
     */
    public function sheets(): array
    {
        $eagerLoads = [
            'user', 'project.division', 'approvals.approver',
            'atrBudgetSelecteds.budgetDetail', 'items.budgetDetail',
            'atr',
        ];

        $service = new ReimbursementService();
        $all = $service->queryReimbursements($this->user, $this->filters)
            ->with($eagerLoads)
            ->get();
        $all->loadMissing([
            'eers.approvals.approver', 'eers.items', 'eers.user',
            'eers.project.division', 'eers.documents',
        ]);

        $type = $this->filters['type'] ?? null;
        $sheets = [];

        if ($type !== ReimbursementType::ALLOWANCE->value) {
            $sheets[] = new AtrSheet($all->where('type', ReimbursementType::ATR)->values());
        }

        if ($type === null || $type === '' || $type === ReimbursementType::ALLOWANCE->value) {
            $sheets[] = new AllowanceSheet($all->where('type', ReimbursementType::ALLOWANCE)->values());
        }

        return $sheets;
    }
}
