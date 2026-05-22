<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Reimbursement;
use Illuminate\Support\Facades\DB;

final readonly class BulkRejectReimbursements
{
    public function __construct(
        private UpdateReimbursementStatus $updateStatus
    ) {}

    /**
     * @param  int[]  $ids
     * @param  array<int, string>  $notesMap
     */
    public function handle(array $ids, array $notesMap, int $approverId, string $role): void
    {
        DB::transaction(function () use ($ids, $notesMap, $approverId, $role): void {
            $reimbursements = Reimbursement::query()->whereIn('id', $ids)->get();

            foreach ($reimbursements as $reimbursement) {
                $this->updateStatus->handle($reimbursement, [
                    'action' => 'rejected',
                    'role' => $role,
                    'notes' => $notesMap[$reimbursement->id] ?? 'Bulk rejected via Dashboard',
                ], $approverId);
            }
        });
    }
}
