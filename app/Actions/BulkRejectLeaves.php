<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Leave;
use Illuminate\Support\Facades\DB;

final readonly class BulkRejectLeaves
{
    public function __construct(
        private RejectLeaveAction $rejectLeaveAction
    ) {}

    /**
     * @param int[] $ids
     * @param array<int, string> $notesMap
     */
    public function handle(array $ids, array $notesMap): void
    {
        DB::transaction(function () use ($ids, $notesMap): void {
            $leaves = Leave::query()->whereIn('id', $ids)->get();

            foreach ($leaves as $leave) {
                $this->rejectLeaveAction->handle($leave, $notesMap[$leave->id] ?? 'Bulk rejected via Dashboard');
            }
        });
    }
}
