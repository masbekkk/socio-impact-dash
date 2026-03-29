<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Leave;
use Illuminate\Support\Facades\DB;

final readonly class BulkRevisionLeaves
{
    public function __construct(
        private RevisionLeaveAction $revisionLeaveAction
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
                $this->revisionLeaveAction->handle($leave, $notesMap[$leave->id] ?? 'Bulk revision via Dashboard');
            }
        });
    }
}
