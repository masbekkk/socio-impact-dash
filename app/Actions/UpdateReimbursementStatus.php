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
            $role = $data['role'] ?? null;

            if ($action === 'transferred') {
                $updateData = [
                    'status' => ReimbursementStatus::Transferred,
                    'transferred_at' => now(),
                ];
                if ($transferProof instanceof UploadedFile) {
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
                ReimbursementApproval::query()->where('reimbursement_id', $reimbursement->id)
                    ->update([
                        'status' => $action === 'request_fund' ? ApprovalStatus::Approved->value : $action,
                        'approved_at' => in_array($action, [ApprovalStatus::Approved->value, 'request_fund']) ? now() : null,
                        'updated_by' => $approverId, // Track who actually took the action
                    ]);
            } else {
                $approval = ReimbursementApproval::query()->where('reimbursement_id', $reimbursement->id)
                    ->where('role', $role)
                    ->first();

                if ($approval) {
                    $approval->update([
                        'status' => $action === 'request_fund' ? ApprovalStatus::Approved->value : $action,
                        'notes' => $notes,
                        'approved_at' => in_array($action, [ApprovalStatus::Approved->value, 'request_fund']) ? now() : null,
                        'updated_by' => $approverId, // Track who actually took the action
                    ]);
                } else {
                    // Fallback to create if it doesn't exist (e.g. legacy data or single-step update)
                    ReimbursementApproval::query()->create([
                        'reimbursement_id' => $reimbursement->id,
                        'role' => $role,
                        'approver_id' => $approverId,
                        'status' => $action === 'request_fund' ? ApprovalStatus::Approved->value : $action,
                        'notes' => $notes,
                        'approved_at' => in_array($action, [ApprovalStatus::Approved->value, 'request_fund']) ? now() : null,
                        'updated_by' => $approverId,
                    ]);
                }
            }

            if ($action === ApprovalStatus::Approved->value || $action === 'request_fund') {
                // Determine if all required approvals are met, but for now user requested status stays submitted
                // until transferred.

                $updateData = [];

                if ($action === 'request_fund') {
                    $updateData['status'] = ReimbursementStatus::Requested;
                }

                if ($transferProof instanceof UploadedFile) {
                    $path = $transferProof->store('reimbursements/transfer-proofs', 'public');
                    $updateData['transfer_proof_path'] = $path;
                    $updateData['transferred_at'] = now();
                    $updateData['status'] = ReimbursementStatus::Transferred; // Explicitly set if proof uploaded
                }

                if (! empty($updateData)) {
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

            if (isset($data['amount'])) {
                $reimbursement->update(['amount' => $data['amount']]);
            }

            // Send notifications for status changes
            if (in_array($action, [ApprovalStatus::Approved->value, 'request_fund', 'revision', 'rejected'], true)) {
                $notifier = new CreateNotification();

                $actionLabels = [
                    ApprovalStatus::Approved->value => 'disetujui',
                    'request_fund' => 'disetujui (request fund)',
                    'revision' => 'diminta revisi',
                    'rejected' => 'ditolak',
                ];
                $label = $actionLabels[$action] ?? $action;

                // Collect recipients: assigned head + all finance + all direktur
                $recipientIds = $notifier->getUserIdsByRoles(['finance', 'direktur']);

                // Add the reimbursement submitter
                if ($reimbursement->user_id) {
                    $recipientIds[] = $reimbursement->user_id;
                }

                // Add head approver if assigned
                $headApproval = ReimbursementApproval::query()->where('reimbursement_id', $reimbursement->id)
                    ->where('role', 'head')
                    ->first();
                if ($headApproval?->approver_id) {
                    $recipientIds[] = $headApproval->approver_id;
                }

                // Remove the person who took the action
                $recipientIds = array_filter($recipientIds, fn (int $id): bool => $id !== $approverId);

                if ($recipientIds !== []) {
                    $notifier->handle(
                        type: 'reimbursement_'.$action,
                        title: 'Update Pengajuan Keuangan',
                        message: "Pengajuan {$reimbursement->code} telah {$label} oleh ".(\App\Models\User::query()->find($approverId)?->name ?? 'System').'.',
                        recipientUserIds: array_values($recipientIds),
                        referenceType: 'reimbursement',
                        referenceId: $reimbursement->id,
                        createdBy: $approverId,
                    );
                }
            }

            return $reimbursement->fresh(['user', 'project', 'documents', 'approvals.approver', 'comments.user']);
        });
    }
}
