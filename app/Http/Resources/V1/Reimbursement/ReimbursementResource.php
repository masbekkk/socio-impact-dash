<?php

declare(strict_types=1);

namespace App\Http\Resources\V1\Reimbursement;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class ReimbursementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'user' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
            ],
            'project' => $this->when($this->project_id !== null, [
                'id' => $this->project?->id,
                'name' => $this->project?->name,
                'code' => $this->project?->code,
                'division_name' => $this->project?->division?->name,
                'pic_name' => $this->project?->pic?->name,
                'head_name' => $this->project?->head?->name,
                'head_email' => $this->project?->head?->email,
                'operational_budget' => $this->project?->operational_budget ? (float) $this->project->operational_budget : null,
                'used_operational_budget' => $this->project ? (float) $this->project->reimbursements()
                    ->where('type', 'atr')
                    ->whereNotIn('status', ['rejected', 'submitted', 'draft'])
                    ->sum('amount') : null,
            ]),
            'type' => $this->type?->value,
            'eer_type' => $this->eer_type,
            'status' => $this->status?->value,
            'amount' => (float) $this->amount,
            'bank_name' => $this->bank_name,
            'bank_account' => $this->bank_account,
            'account_holder' => $this->account_holder,
            'usage_plan' => $this->usage_plan,
            'urgency' => $this->urgency,
            'transferred_at' => $this->transferred_at?->toISOString(),
            'transfer_proof_path' => $this->transfer_proof_path,
            'rejection_reason' => $this->rejection_reason,
            'documents' => ReimbursementDocumentResource::collection(
                $this->whenLoaded('documents')
            ),
            'comments' => $this->whenLoaded('comments', function (): \Illuminate\Support\Collection {
                return $this->comments->map(function (\App\Models\ReimbursementComment $item): array {
                    return [
                        'id' => $item->id,
                        'user_id' => $item->user_id,
                        'user_name' => $item->user?->name ?? 'Unknown',
                        'comment' => $item->comment,
                        'created_at' => $item->created_at?->toISOString(),
                    ];
                });
            }),
            'approvals' => $this->whenLoaded('approvals', function (): \Illuminate\Support\Collection {
                return $this->approvals->map(function (\App\Models\ReimbursementApproval $item): array {
                    return [
                        'id' => $item->id,
                        'approver_id' => $item->approver_id,
                        'approver_name' => $item->approver?->name ?? 'Unknown',
                        'role' => $item->role,
                        'status' => $item->status,
                        'notes' => $item->notes,
                        'approved_at' => $item->approved_at?->toISOString(),
                    ];
                });
            }),
            'can_approve' => $this->calculateCanApprove($request),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'atr_budget_selecteds' => $this->whenLoaded('atrBudgetSelecteds', function (): \Illuminate\Support\Collection {
                return $this->atrBudgetSelecteds->map(function (\App\Models\AtrBudgetSelected $item): array {
                    return [
                        'id' => $item->id,
                        'project_budget_detail_id' => $item->project_budget_detail_id,
                        'amount' => (float) $item->amount,
                        'notes' => $item->budgetDetail->notes ?? '', // Load the note text
                    ];
                });
            }),
        ];
    }

    private function calculateCanApprove(Request $request): bool
    {
        $user = $request->user();
        if (! $user) {
            return false;
        }

        if ($user->hasRole('superadmin')) {
            return true;
        }

        // Requester cannot approve their own reimbursement unless they are superadmin
        if ($this->user_id === $user->id) {
            return false;
        }

        // To prevent users from approving the same state multiple times, we check status transitions.
        $status = $this->status?->value;

        // If a user has already approved at the current stage, hide buttons.
        $hasApprovedCurrentStage = false;

        if ($status === 'submitted') {
            $hasApprovedCurrentStage = $this->approvals->where('approver_id', $user->id)->where('role', 'head')->where('status', 'approved')->isNotEmpty();
            if (! $hasApprovedCurrentStage) {
                return $this->project?->head_id === $user->id || $user->hasRole('direktur') || $user->hasRole('finance') || $user->hasRole('head');
            }
        }

        if (in_array($status, ['head_approved', 'revision'])) {
            $hasApprovedCurrentStage = $this->approvals->where('approver_id', $user->id)->where('role', 'finance')->where('status', 'approved')->isNotEmpty();
            if (! $hasApprovedCurrentStage) {
                return $user->hasRole('finance') || $user->hasRole('direktur') || $user->hasRole('head');
            }
        }

        if ($status === 'finance_approved') {
            // Usually awaiting transfer, so no further "approval" button unless it's for transfer.
            // But let's allow direktur or finance if they still need to act.
            // Actually, if it's finance approved, we shouldn't show approve buttons unless we also show the transfer upload in Show.tsx.
            // Assuming they're allowed for direktur or finance:
            return $user->hasRole('direktur') || $user->hasRole('head');
        }

        return false;
    }
}
