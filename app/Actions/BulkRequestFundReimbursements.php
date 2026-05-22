<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Reimbursement;
use Illuminate\Support\Facades\DB;

final readonly class BulkRequestFundReimbursements
{
    public function __construct(
        private UpdateReimbursementStatus $updateStatus
    ) {}

    /**
     * @param  int[]  $ids
     */
    public function handle(array $ids, int $approverId, string $role): void
    {
        DB::transaction(function () use ($ids, $approverId, $role): void {
            $reimbursements = Reimbursement::query()->whereIn('id', $ids)->get();

            foreach ($reimbursements as $reimbursement) {
                $this->updateStatus->handle($reimbursement, [
                    'action' => 'request_fund',
                    'role' => $role,
                    'notes' => 'Bulk requested fund via Dashboard',
                ], $approverId);
            }
        });
    }
}
