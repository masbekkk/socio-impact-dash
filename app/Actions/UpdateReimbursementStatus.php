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

            if ($role === null) {
                $user = \App\Models\User::find($approverId);
                if ($user) {
                    $roles = $user->getRoleNames();
                    if ($roles->contains('head')) {
                        // Prioritize Head over Finance/HR if this user was assigned as Head
                        $isHead = ($user->id === $reimbursement->project?->head_id) ||
                                 ReimbursementApproval::where('reimbursement_id', $reimbursement->id)
                                     ->where('approver_id', $user->id)
                                     ->where('role', 'head')
                                     ->exists();

                        if ($isHead) {
                            $role = 'head';
                        } else {
                            $role = $roles->first();
                        }
                    } else {
                        $role = $roles->first();
                    }
                }
            }

            if ($action === 'transferred') {
                $statusToSet = ReimbursementStatus::Transferred;

                if ($reimbursement->type === \App\Enums\ReimbursementType::EER && in_array($reimbursement->eer_type, ['refund', 'reimbursement'], true)) {
                    $statusToSet = ReimbursementStatus::Closed;
                }

                $updateData = [
                    'status' => $statusToSet,
                    'transferred_at' => now(),
                ];
                if (isset($data['transferred_amount'])) {
                    $updateData['transferred_amount'] = (float) $data['transferred_amount'];
                }
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
                // Dual Role Logic for ATR/EER: If Finance/HR is also Head, clear both.
                if (in_array($reimbursement->type, [\App\Enums\ReimbursementType::ATR, \App\Enums\ReimbursementType::EER]) &&
                    in_array($action, [ApprovalStatus::Approved->value, 'request_fund'])) {

                    $user = \App\Models\User::find($approverId);
                    if ($user && $user->hasRole('finance') && $user->hasRole('head')) {
                        $isAssignedHead = ($user->id === $reimbursement->project?->head_id) ||
                                         ReimbursementApproval::where('reimbursement_id', $reimbursement->id)
                                             ->where('role', 'head')
                                             ->exists();

                        if ($isAssignedHead) {
                            // Automatically approve Head record if pending
                            ReimbursementApproval::query()->where('reimbursement_id', $reimbursement->id)
                                ->where('role', 'head')
                                ->where('status', ApprovalStatus::Pending->value)
                                ->update([
                                    'status' => ApprovalStatus::Approved->value,
                                    'approved_at' => now(),
                                    'updated_by' => $approverId,
                                    'notes' => ($notes ? $notes.' ' : '').'(Auto-approved by Finance with Dual Role)',
                                ]);

                            // Ensure we act as Finance to reach finance_approved status
                            $role = 'finance';
                        }
                    }

                    // Dual Role Logic for EER: Head + HR
                    if ($user && $user->hasRole('hr') && $user->hasRole('head') && ($reimbursement->type === \App\Enums\ReimbursementType::EER || $reimbursement->type === \App\Enums\ReimbursementType::ATR)) {
                        $isAssignedHead = ($user->id === $reimbursement->project?->head_id) ||
                                         ReimbursementApproval::where('reimbursement_id', $reimbursement->id)
                                             ->where('role', 'head')
                                             ->exists();

                        if ($isAssignedHead) {
                            // Prioritize acting as Head for EER to reach head_approved status
                            $role = 'head';
                        }
                    }
                }

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
                $updateData = [];

                if ($action === 'request_fund') {
                    $updateData['status'] = ReimbursementStatus::Requested;
                } else {
                    // Update main status based on role
                    $roleStatusMap = [
                        'head' => ReimbursementStatus::HeadApproved,
                        'hr' => ReimbursementStatus::HRApproved,
                        'finance' => ReimbursementStatus::FinanceApproved,
                        'direktur' => ReimbursementStatus::Approved,
                        'superadmin' => ReimbursementStatus::Approved,
                    ];

                    if (isset($roleStatusMap[$role])) {
                        if ($role === 'direktur' && $reimbursement->type === \App\Enums\ReimbursementType::EER && $reimbursement->eer_type === 'balance') {
                            $updateData['status'] = ReimbursementStatus::Closed;
                        } else {
                            $updateData['status'] = $roleStatusMap[$role];
                        }
                    }
                }

                if ($transferProof instanceof UploadedFile) {
                    $path = $transferProof->store('reimbursements/transfer-proofs', 'public');
                    $updateData['transfer_proof_path'] = $path;
                    $updateData['transferred_at'] = now();

                    $statusToSet = ReimbursementStatus::Transferred;
                    if ($reimbursement->type === \App\Enums\ReimbursementType::EER && in_array($reimbursement->eer_type, ['refund', 'reimbursement'], true)) {
                        $statusToSet = ReimbursementStatus::Closed;
                    }
                    $updateData['status'] = $statusToSet;
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
                    /** @var \App\Models\Project|null $project */
                    $project = $reimbursement->project;
                    $projectName = $project ? $project->name : 'Non-Project';
                    $amount = 'Rp '.number_format((float) $reimbursement->amount, 0, ',', '.');

                    /** @var \App\Models\User|null $approverUser */
                    $approverUser = \App\Models\User::query()->find($approverId);
                    $approverName = $approverUser ? $approverUser->name : 'System';

                    $notifier->handle(
                        type: 'reimbursement_'.$action,
                        title: 'Update Pengajuan Keuangan',
                        message: "Pengajuan {$reimbursement->code} untuk proyek '{$projectName}' senilai {$amount} telah {$label} oleh {$approverName}.",
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
