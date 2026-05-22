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
     * @param  int[]  $ids
     * @param  array<int, string>  $notes
     */
    public function handle(array $ids, array $notes, string $role): void
    {
        DB::transaction(function () use ($ids, $notes, $role): void {
            $leaves = Leave::query()->whereIn('id', $ids)->get();

            foreach ($leaves as $leave) {
                $note = $notes[$leave->id] ?? 'Bulk revision via Dashboard';
                $this->revisionLeaveAction->handle($leave, $note, $role);
            }
        });
    }
}
