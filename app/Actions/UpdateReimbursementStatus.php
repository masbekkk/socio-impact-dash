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

            ReimbursementApproval::create([
                'reimbursement_id' => $reimbursement->id,
                'approver_id' => $approverId,
                'role' => $role,
                'status' => $action,
                'notes' => $notes,
                'approved_at' => now(),
            ]);

            if ($action === ApprovalStatus::Approved->value) {
                $newStatus = match ($role) {
                    'finance' => ReimbursementStatus::FinanceApproved,
                    default => ReimbursementStatus::HeadApproved,
                };

                $updateData = ['status' => $newStatus];

                if ($transferProof !== null) {
                    $path = $transferProof->store('reimbursements/transfer-proofs', 'public');
                    $updateData['transfer_proof_path'] = $path;
                    $updateData['transferred_at'] = now();
                }

                $reimbursement->update($updateData);
            } else {
                $reimbursement->update([
                    'status' => ReimbursementStatus::Rejected,
                    'rejection_reason' => $notes,
                ]);
            }

            return $reimbursement->fresh(['user', 'project', 'documents', 'approvals.approver']);
        });
    }
}
