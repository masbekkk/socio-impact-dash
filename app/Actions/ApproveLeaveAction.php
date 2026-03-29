<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Leave;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

final readonly class ApproveLeaveAction
{
    /**
     * Execute the action.
     */
    public function handle(Leave $leave, ?string $notes = null, ?string $role = null): Leave
    {
        return DB::transaction(function () use ($leave, $notes, $role): Leave {
            $user = Auth::user();
            throw_unless($user, \Exception::class, 'User not authenticated');
            /** @var \App\Models\User $user */
            
            if ($role === null) {
                $roles = $user->getRoleNames();
                if ($roles->contains('head') && $roles->contains('finance')) {
                    // Smart detection: if user is assigned as project head, act as head.
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
                    'status' => \App\Enums\ApprovalStatus::Approved,
                    'notes' => $notes,
                    'approved_at' => now(),
                ]);
            } else {
                // Fallback for superadmin or if specifically assigned
                $leave->approvals()->create([
                    'approver_id' => $user->id,
                    'role' => $role,
                    'status' => \App\Enums\ApprovalStatus::Approved,
                    'notes' => $notes,
                    'approved_at' => now(),
                ]);
            }

            $nextStatus = match ($role) {
                'head' => \App\Enums\LeaveStatus::HeadApproved,
                'direktur' => \App\Enums\LeaveStatus::DirekturApproved,
                'hr' => \App\Enums\LeaveStatus::HRApproved,
                'superadmin' => \App\Enums\LeaveStatus::SuperAdminApproved,
                default => $leave->status,
            };

            $leave->update(['status' => $nextStatus]);

            return $leave->fresh(['user', 'project', 'replacementPic', 'approvals.approver']);
        });
    }
}
