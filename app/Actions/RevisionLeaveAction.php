<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Leave;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

final readonly class RevisionLeaveAction
{
    /**
     * Execute the action.
     */
    public function handle(Leave $leave, string $notes, ?string $role = null): Leave
    {
        return DB::transaction(function () use ($leave, $notes, $role): Leave {
            $user = Auth::user();
            throw_unless($user, \Exception::class, 'User not authenticated');
            /** @var \App\Models\User $user */

            if ($role === null) {
                $roles = $user->getRoleNames();
                if ($roles->contains('head') && $roles->contains('finance')) {
                    $role = ($user->id === $leave->project?->head_id) ? 'head' : 'finance';
                } else {
                    $role = $roles->first();
                }
            }

            $approval = $leave->approvals()
                ->where('role', $role)
                ->where('status', \App\Enums\ApprovalStatus::Pending)
                ->first();

            if ($approval) {
                $approval->update([
                    'status' => \App\Enums\ApprovalStatus::Rejected, // Approval status for 'needs revision' is often mapped to 'Rejected' record-wise but 'Revision' status-wise
                    'notes' => $notes,
                    'approved_at' => now(),
                ]);
            } else {
                $leave->approvals()->create([
                    'approver_id' => $user->id,
                    'role' => $role,
                    'status' => \App\Enums\ApprovalStatus::Rejected,
                    'notes' => $notes,
                    'approved_at' => now(),
                ]);
            }

            $leave->update(['status' => \App\Enums\LeaveStatus::Revision]);

            return $leave->fresh(['user', 'project', 'replacementPic', 'approvals.approver']);
        });
    }
}
