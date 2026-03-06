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
            'refund_reimburse_amount' => $this->amount,
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
                        'notes' => $item->notes, // Load the note text from pivot
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

        // Requester cannot approve their own reimbursement (unless superadmin, checked above)
        // EXCEPT: if the user is a Head, the user specifically requested they can approve if they are the creator
        $isCreator = $this->user_id === $user->id;

        $statusValue = $this->status?->value;

        // Final statuses cannot be approved further
        if (in_array($statusValue, ['transferred', 'rejected'])) {
            return false;
        }

        // ROLE-BASED CHECK WITH RESTRICTION FOR HEAD
        $isHeadRole = $user->hasRole('head');
        $isFinanceRole = $user->hasRole('finance');
        $isDirekturRole = $user->hasRole('direktur');

        // If user is ONLY a Head (not Finance/Direktur), check assignment or creator
        if ($isHeadRole && ! $isFinanceRole && ! $isDirekturRole) {
            $isAssigned = $this->approvals->where('approver_id', $user->id)->where('role', 'head')->isNotEmpty();
            if (! $isAssigned && ! $isCreator) {
                return false;
            }
        }

        // If user is the creator but NOT a head/finance/direktur, they definitely can't approve
        if ($isCreator && ! $isHeadRole && ! $isFinanceRole && ! $isDirekturRole) {
            return false;
        }

        // Effective stage calculation
        $effectiveStage = 'submitted';
        $headApproval = $this->approvals->where('role', 'head')->first();
        $hrApproval = $this->approvals->where('role', 'hr')->first();
        $financeApproval = $this->approvals->where('role', 'finance')->first();

        if ($headApproval && $headApproval->status->value === 'approved') {
            $effectiveStage = 'head_approved';
            if ($hrApproval && $hrApproval->status->value === 'approved') {
                $effectiveStage = 'hr_approved';
            }
        }

        // Special override for Revision: usually requester should resubmit, but maybe head/finance can still approve?
        // Actually for now let's assume if status is 'revision', only 'submitted' (after resubmit) can be approved.
        if ($statusValue === 'revision' || $statusValue === 'draft') {
            return false;
        }

        // ROLE-BASED CHECK
        // If user has the role and that role is PENDING, they can approve.

        // 1. Head Approval Phase
        if ($effectiveStage === 'submitted' || $effectiveStage === 'revised') {
            if ($user->hasRole('head') || $user->hasRole('direktur')) {
                $pendingHead = $this->approvals->where('role', 'head')->where('status', 'pending')->isNotEmpty();
                if ($pendingHead) {
                    return true;
                }
            }
        }

        // 2. HR Approval Phase (Allowance only)
        if ($effectiveStage === 'head_approved' && $this->type->value === 'allowance') {
            if ($user->hasRole('hr') || $user->hasRole('direktur')) {
                $pendingHR = $this->approvals->where('role', 'hr')->where('status', 'pending')->isNotEmpty();
                if ($pendingHR) {
                    return true;
                }
            }
        }

        // 3. Finance Approval Phase
        // For ATR: after Head. For Allowance: after HR.
        $financeStage = ($this->type->value === 'atr') ? 'head_approved' : 'hr_approved';
        if ($effectiveStage === $financeStage || ($this->type->value === 'atr' && $effectiveStage === 'head_approved')) {
            if ($user->hasRole('finance') || $user->hasRole('direktur')) {
                $pendingFinance = $this->approvals->where('role', 'finance')->where('status', 'pending')->isNotEmpty();
                if ($pendingFinance) {
                    return true;
                }
            }
        }

        // 4. Direktur Final Phase (After Finance)
        $financeApproved = $financeApproval && $financeApproval->status->value === 'approved';
        if ($financeApproved) {
            if ($user->hasRole('direktur')) {
                // Direktur can always approve if finance is done and it's not final yet
                return true;
            }
        }

        return false;
    }
}
