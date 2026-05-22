<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Leave;
use Illuminate\Support\Facades\DB;

final readonly class BulkApproveLeaves
{
    public function __construct(
        private ApproveLeaveAction $approveLeaveAction
    ) {}

    /**
     * @param  int[]  $ids
     */
    public function handle(array $ids, string $role): void
    {
        DB::transaction(function () use ($ids, $role): void {
            $leaves = Leave::query()->whereIn('id', $ids)->get();

            foreach ($leaves as $leave) {
                $this->approveLeaveAction->handle($leave, 'Bulk approved via Dashboard', $role);
            }
        });
    }
}
