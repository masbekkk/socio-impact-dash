<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\ApprovalStatus;
use App\Enums\ReimbursementStatus;
use App\Models\Reimbursement;
use App\Models\ReimbursementApproval;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

final readonly class UpdateReimbursementStatus
{
    public function handle(Reimbursement $reimbursement, array $data, int $approverId, ?UploadedFile $transferProof = null): Reimbursement
    {
        return DB::transaction(function () use ($reimbursement, $data, $approverId, $transferProof): Reimbursement {
            $action = $data['action'];
            $notes = $data['notes'] ?? null;
            $role = $data['role'] ?? 'head';

            if ($role === 'direktur') {
                // Direktur override: update ALL approval records for this reimbursement
                ReimbursementApproval::where('reimbursement_id', $reimbursement->id)
                    ->update([
                        'approver_id' => $approverId,
                        'status' => $action,
                        'notes' => $notes,
                        'approved_at' => $action === ApprovalStatus::Approved->value ? now() : null,
                    ]);
            } else {
                ReimbursementApproval::updateOrCreate(
                    [
                        'reimbursement_id' => $reimbursement->id,
                        'role' => $role,
                    ],
                    [
                        'approver_id' => $approverId,
                        'status' => $action,
                        'notes' => $notes,
                        'approved_at' => $action === ApprovalStatus::Approved->value ? now() : null,
                    ]
                );
            }

            if ($action === ApprovalStatus::Approved->value) {
                // If the approver is a Direktur, they have absolute authority to approve the ATR immediately.
                if ($role === 'direktur') {
                    $newStatus = ReimbursementStatus::Transferred; // Or whatever final status is appropriate for direktur override, but typically they bypass to finance
                    // Usually direktur approval just finalizes it to be ready for transfer, or maybe FinanceApproved is the cap before actual transfer.
                    // Let's set it to FinanceApproved so Finance can transfer it. Note: If we need a 'DirekturApproved' status, we should add it.
                    // Based on existing statuses, 'FinanceApproved' is the highest before 'Transferred'.
                    $newStatus = ReimbursementStatus::FinanceApproved;

                    // Auto-approve pending lower levels (Head, Finance) for history sanity if needed, or simply let the status change bypass them.
                    // We will just let the status change bypass them.
                } else {
                    $newStatus = match ($role) {
                        'finance' => ReimbursementStatus::FinanceApproved,
                        default => ReimbursementStatus::HeadApproved,
                    };
                }

                $updateData = ['status' => $newStatus];

                if ($transferProof !== null) {
                    $path = $transferProof->store('reimbursements/transfer-proofs', 'public');
                    $updateData['transfer_proof_path'] = $path;
                    $updateData['transferred_at'] = now();
                    $updateData['status'] = ReimbursementStatus::Transferred; // Explicitly set if proof uploaded
                }

                $reimbursement->update($updateData);
            } elseif ($action === 'revision') {
                $reimbursement->update([
                    'status' => ReimbursementStatus::Revision,
                ]);

                // Store the revision note as a comment
                if ($notes) {
                    $reimbursement->comments()->create([
                        'user_id' => $approverId,
                        'comment' => $notes,
                    ]);
                }
            } else {
                $reimbursement->update([
                    'status' => ReimbursementStatus::Rejected,
                    'rejection_reason' => $notes,
                ]);
            }

            return $reimbursement->fresh(['user', 'project', 'documents', 'approvals.approver', 'comments.user']);
        });
    }
}
