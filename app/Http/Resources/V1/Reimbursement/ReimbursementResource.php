<?php

declare(strict_types=1);

namespace App\Http\Resources\V1\Reimbursement;

use App\Enums\ReimbursementType;
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
                'uuid' => $this->project?->uuid,
                'name' => $this->project?->name,
                'code' => $this->project?->code,
                'division_name' => $this->project?->division?->name,
                'pic_name' => $this->project?->pic?->name,
                'head_name' => $this->project?->head?->name,
                'head_email' => $this->project?->head?->email,
                'budget_total' => $this->project?->budget_total ? (float) $this->project->budget_total : null,
                'operational_budget' => $this->project?->operational_budget ? (float) $this->project->operational_budget : null,
                'management_budget' => $this->project?->management_budget ? (float) $this->project->management_budget : null,
                'allowance_budget' => $this->project?->allowance_budget ? (float) $this->project->allowance_budget : null,
                'used_operational_budget' => $this->project ? (float) $this->project->reimbursements()
                    ->where('type', 'atr')
                    ->whereNotIn('status', ['rejected', 'submitted', 'draft'])
                    ->sum('amount') : null,
                'used_allowance_budget' => $this->project ? (float) $this->project->reimbursements()
                    ->where('type', 'allowance')
                    ->whereNotIn('status', ['rejected', 'submitted', 'draft', 'revision'])
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
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
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
            'items' => $this->whenLoaded('items', function (): \Illuminate\Support\Collection {
                return $this->items->map(function (\App\Models\ReimbursementItem $item): array {
                    return [
                        'id' => $item->id,
                        'parent_item_id' => $item->parent_item_id,
                        'item_name' => $item->item_name,
                        'quantity' => $item->quantity,
                        'unit_price' => (float) $item->unit_price,
                        'amount' => (float) $item->amount,
                        'expense_type' => $item->expense_type?->value,
                        'receipt_path' => $item->receipt_path,
                        'notes' => $item->notes,
                        'activity_name' => $item->budgetDetail?->item_name ?? $item->budgetDetail?->notes ?? '-',
                        'activity_id' => $item->project_budget_detail_id,
                    ];
                });
            }),
            'atr_items' => $this->when(
                $this->type === ReimbursementType::EER && $this->atr_id !== null,
                function () {
                    $atr = $this->atr;
                    if (! $atr) {
                        return [];
                    }
                    $atr->loadMissing('items');

                    return $atr->items->where('parent_item_id', null)->map(function (\App\Models\ReimbursementItem $item): array {
                        return [
                            'id' => $item->id,
                            'item_name' => $item->item_name,
                            'quantity' => $item->quantity,
                            'unit_price' => (float) $item->unit_price,
                            'amount' => (float) $item->amount,
                            'expense_type' => $item->expense_type?->value,
                            'notes' => $item->notes,
                            'activity_name' => $item->budgetDetail?->item_name ?? $item->budgetDetail?->notes ?? '-',
                            'activity_id' => $item->project_budget_detail_id,
                        ];
                    })->values();
                }
            ),
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

        // To prevent users from approving the same state multiple times, we check status transitions.
        $status = $this->status?->value;
        $effectiveStatus = $status;

        // Since the main status stays 'submitted' until transferred, we deduce the effective stage
        // based on the individual approval records.
        if ($status === 'submitted') {
            $headApproval = $this->approvals->where('role', 'head')->first();
            $hrApproval = $this->approvals->where('role', 'hr')->first();

            if ($headApproval && $headApproval->status->value === 'approved') {
                $effectiveStatus = 'head_approved';
                if ($hrApproval && $hrApproval->status->value === 'approved') {
                    $effectiveStatus = 'hr_approved';
                }
            }
        }

        // If a user has already approved at the current stage, hide buttons.
        $hasApprovedCurrentStage = false;

        if ($effectiveStatus === 'submitted') {
            $hasApproved = $this->approvals->where('approver_id', $user->id)->where('status', 'approved')->isNotEmpty();
            if ($hasApproved) {
                return false;
            }

            $myPendingApproval = $this->approvals->where('approver_id', $user->id)->where('status', 'pending');
            if ($myPendingApproval->isNotEmpty()) {
                return true;
            }

            // Fallback for project head or generic role if no specific assignment exists
            if ($this->project?->head_id === $user->id || $user->hasRole('direktur')) {
                return true;
            }

            // If there's an assignment for someone else in 'head' role, this user cannot approve unless they are superadmin/direktur
            $someoneElseAssignedHead = $this->approvals->where('role', 'head')->where('status', 'pending')->isNotEmpty();
            if (! $someoneElseAssignedHead && $user->hasRole('head')) {
                return true;
            }
        }

        if (in_array($effectiveStatus, ['head_approved', 'hr_approved', 'revision'])) {
            $hasApproved = $this->approvals->where('approver_id', $user->id)->where('status', 'approved')->isNotEmpty();
            if ($hasApproved) {
                return false;
            }

            $myPendingApproval = $this->approvals->where('approver_id', $user->id)->where('status', 'pending');
            if ($myPendingApproval->isNotEmpty()) {
                return true;
            }

            if ($user->hasRole('direktur')) {
                return true;
            }

            // For allowance, next is HR. For ATR, next is Finance.
            if ($this->type->value === 'allowance') {
                $someoneElseAssignedHR = $this->approvals->where('role', 'hr')->where('status', 'pending')->isNotEmpty();
                if (! $someoneElseAssignedHR && $user->hasRole('hr')) {
                    return true;
                }

                if ($effectiveStatus === 'hr_approved') {
                    $someoneElseAssignedFinance = $this->approvals->where('role', 'finance')->where('status', 'pending')->isNotEmpty();
                    if (! $someoneElseAssignedFinance && $user->hasRole('finance')) {
                        return true;
                    }
                }
            } else {
                $someoneElseAssignedFinance = $this->approvals->where('role', 'finance')->where('status', 'pending')->isNotEmpty();
                if (! $someoneElseAssignedFinance && $user->hasRole('finance')) {
                    return true;
                }
            }
        }

        if ($effectiveStatus === 'finance_approved') {
            return $user->hasRole('direktur') || $user->hasRole('head') || $user->hasRole('superadmin');
        }

        // Requester cannot approve their own reimbursement unless they are superadmin
        if ($this->user_id === $user->id) {
            // / TODO: only if head return true
            return false;
        }

        return false;
    }
}
