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

            if ($action === 'transferred') {
                $updateData = [
                    'status' => ReimbursementStatus::Transferred,
                    'transferred_at' => now(),
                ];
                if ($transferProof !== null) {
                    $path = $transferProof->store('reimbursements/transfer-proofs', 'public');
                    $updateData['transfer_proof_path'] = $path;
                }
                $reimbursement->update($updateData);

                // Option to add a comment about transfer, etc.
                if ($notes) {
                    $reimbursement->comments()->create([
                        'user_id' => $approverId,
                        'comment' => $notes,
                    ]);
                }

                return $reimbursement->fresh(['user', 'project', 'documents', 'approvals.approver', 'comments.user']);
            }

            if ($role === 'direktur') {
                // Direktur override: update ALL approval records for this reimbursement
                ReimbursementApproval::where('reimbursement_id', $reimbursement->id)
                    ->update([
                        // 'approver_id' => $approverId,
                        'status' => $action,
                        // 'notes' => $notes,
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
                // Determine if all required approvals are met, but for now user requested status stays submitted
                // until transferred.
                
                $updateData = [];

                if ($transferProof !== null) {
                    $path = $transferProof->store('reimbursements/transfer-proofs', 'public');
                    $updateData['transfer_proof_path'] = $path;
                    $updateData['transferred_at'] = now();
                    $updateData['status'] = ReimbursementStatus::Transferred; // Explicitly set if proof uploaded
                }

                if (!empty($updateData)) {
                    $reimbursement->update($updateData);
                }
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
            } elseif ($action === 'rejected') {
                $reimbursement->update([
                    'status' => ReimbursementStatus::Rejected,
                    'rejection_reason' => $notes,
                ]);
            }

            return $reimbursement->fresh(['user', 'project', 'documents', 'approvals.approver', 'comments.user']);
        });
    }
}
