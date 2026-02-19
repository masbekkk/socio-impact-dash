<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\ApprovalStatus;
use App\Enums\ReimbursementStatus;
use App\Models\Reimbursement;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

final readonly class ApproveReimbursement
{
    public function handle(Reimbursement $reimbursement, ?string $notes = null): Reimbursement
    {
        return DB::transaction(function () use ($reimbursement, $notes) {
            $user = Auth::user();
            if (! $user) {
                throw new Exception('User not authenticated');
            }
            /** @var \App\Models\User $user */
            $role = $user->getRoleNames()->first();

            $approval = $reimbursement->approvals()
                ->where('role', $role)
                ->where('status', 'pending')
                ->first();

            if ($approval) {
                $approval->update([
                    'status' => ApprovalStatus::Approved,
                    'notes' => $notes,
                    'approved_at' => now(),
                ]);
            }

            $nextStatus = match ($role) {
                'head' => ReimbursementStatus::HeadApproved,
                'finance' => ReimbursementStatus::FinanceApproved,
                default => $reimbursement->status,
            };

            $reimbursement->update(['status' => $nextStatus]);

            return $reimbursement->fresh();
        });
    }
}
