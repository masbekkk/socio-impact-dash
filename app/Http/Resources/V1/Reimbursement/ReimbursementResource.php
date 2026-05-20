<?php

declare(strict_types=1);

namespace App\Http\Resources\V1\Reimbursement;

use App\Enums\ReimbursementType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use UnitEnum;

final class ReimbursementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'atr_id' => $this->atr_id,
            'replacement_pic_id' => $this->replacement_pic_id,
            'user' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
            ],
            'project' => $this->when($this->project_id !== null, [
                'id' => $this->project?->id,
                'uuid' => $this->project?->uuid,
                'name' => $this->project?->name,
                'code' => $this->project?->code,
                'initial_project' => $this->project?->initial_project,
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
                'used_eer_budget' => $this->project ? (float) $this->project->reimbursements()
                    ->where('type', 'eer')
                    ->whereNotIn('status', ['rejected', 'submitted', 'draft'])
                    ->sum('amount') : null,
                'used_eer_refund_budget' => $this->project ? (float) $this->project->reimbursements()
                    ->where('type', 'eer')
                    ->where('eer_type', 'refund')
                    ->whereNotIn('status', ['rejected', 'submitted', 'draft'])
                    ->sum('amount') : null,
                'used_eer_reimbursement_budget' => $this->project ? (float) $this->project->reimbursements()
                    ->where('type', 'eer')
                    ->where('eer_type', 'reimbursement')
                    ->whereNotIn('status', ['rejected', 'submitted', 'draft'])
                    ->sum('amount') : null,
                'used_allowance_budget' => $this->project ? (float) $this->project->reimbursements()
                    ->where('type', 'allowance')
                    ->whereNotIn('status', ['rejected', 'submitted', 'draft', 'revision'])
                    ->sum('amount') : null,
                'budget_details' => $this->project?->budgetDetails->map(fn ($bd): array => [
                    'id' => $bd->id,
                    'item_name' => $bd->item_name,
                    'amount' => (float) ($bd->amount_pelaksanaan ?? $bd->amount),
                    'remaining_amount' => (float) $bd->remaining_amount,
                ]),
            ]),
            'type' => $this->type?->value,
            'eer_type' => $this->eer_type,
            'refund_reimburse_amount' => $this->amount,
            'status' => $this->status?->value,
            'amount' => (float) $this->amount,
            'transferred_amount' => (float) $this->transferred_amount,
            'bank_name' => $this->bank_name,
            'bank_account' => $this->bank_account,
            'account_holder' => $this->account_holder,
            'bank_branch' => $this->bank_branch,
            'notes' => $this->usage_plan,
            'usage_plan' => match ($this->type) {
                ReimbursementType::ALLOWANCE => $this->usage_plan,
                ReimbursementType::ATR, ReimbursementType::EER => $this->atrBudgetSelecteds->count() > 0
                    ? $this->atrBudgetSelecteds->pluck('notes')->filter()->implode(', ')
                    : $this->usage_plan,
                default => $this->usage_plan,
            },
            'urgency' => $this->urgency,
            'transferred_at' => $this->transferred_at?->toISOString(),
            'transfer_proof_path' => $this->transfer_proof_path,
            'rejection_reason' => $this->rejection_reason,
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'start_time' => $this->start_time ? mb_substr($this->start_time, 0, 5) : null,
            'end_time' => $this->end_time ? mb_substr($this->end_time, 0, 5) : null,
            'documents' => ReimbursementDocumentResource::collection(
                $this->whenLoaded('documents')
            ),
            'comments' => $this->whenLoaded('comments', fn (): \Illuminate\Support\Collection => $this->comments->map(fn (\App\Models\ReimbursementComment $item): array => [
                'id' => $item->id,
                'user_id' => $item->user_id,
                'user_name' => $item->user?->name ?? 'Unknown',
                'comment' => $item->comment,
                'image_path' => $item->image_path,
                'created_at' => $item->created_at?->toISOString(),
            ])),
            'eers' => $this->whenLoaded('eers', fn (): \Illuminate\Support\Collection => $this->eers->map(fn (\App\Models\Reimbursement $item): array => [
                'id' => $item->id,
                'code' => $item->code,
                'type' => $item->type instanceof UnitEnum ? $item->type->value : $item->type,
                'eer_type' => $item->eer_type,
                'status' => $item->status instanceof UnitEnum ? $item->status->value : $item->status,
                'amount' => (float) $item->amount,
                'usage_plan' => $item->usage_plan,
                'urgency' => $item->urgency,
                'created_at' => $item->created_at?->toISOString(),
                'user' => [
                    'id' => $item->user?->id,
                    'name' => $item->user?->name,
                ],
                'project' => [
                    'id' => $item->project?->id,
                    'name' => $item->project?->name,
                    'code' => $item->project?->code,
                ],
                'approvals' => $item->approvals->map(fn ($app): array => [
                    'id' => $app->id,
                    'role' => $app->role instanceof UnitEnum ? $app->role->value : $app->role,
                    'status' => $app->status instanceof UnitEnum ? $app->status->value : $app->status,
                    'approver' => [
                        'id' => $app->approver?->id,
                        'name' => $app->approver?->name,
                    ],
                ]),
            ])),
            'approvals' => $this->whenLoaded('approvals', function (): \Illuminate\Support\Collection {
                $priority = [
                    'head' => 1,
                    'hr' => 2,
                    'finance' => 3,
                    'direktur' => 4,
                ];

                return $this->approvals->sortBy(function ($approval) use ($priority): int {
                    $roleValue = $approval->role instanceof UnitEnum ? $approval->role->value : (string) $approval->role;

                    return $priority[mb_strtolower($roleValue)] ?? 99;
                })->values()->map(fn (\App\Models\ReimbursementApproval $item): array => [
                    'id' => $item->id,
                    'approver_id' => $item->approver_id,
                    'approver' => [
                        'id' => $item->approver?->id,
                        'name' => $item->approver?->name,
                    ],
                    'approver_name' => $item->approver?->name ?? 'Unknown',
                    'role' => $item->role instanceof UnitEnum ? $item->role->value : $item->role,
                    'status' => $item->status instanceof UnitEnum ? $item->status->value : $item->status,
                    'notes' => $item->notes,
                    'approved_at' => $item->approved_at?->toISOString(),
                ]);
            }),
            'can_approve' => $this->calculateCanApprove($request),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'atr_budget_selecteds' => $this->whenLoaded('atrBudgetSelecteds', fn (): \Illuminate\Support\Collection => $this->atrBudgetSelecteds->map(fn (\App\Models\AtrBudgetSelected $item): array => [
                'id' => $item->id,
                'project_budget_detail_id' => $item->project_budget_detail_id,
                'amount' => (float) $item->amount,
                'notes' => $item->notes,
                'activity_name' => $item->budgetDetail?->item_name ?? $item->budgetDetail?->notes ?? '-',
            ])),
            'items' => $this->whenLoaded('items', fn (): \Illuminate\Support\Collection => $this->items->map(fn (\App\Models\ReimbursementItem $item): array => [
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
            ])),
            'atr_items' => $this->when(
                $this->type === ReimbursementType::EER && $this->atr_id !== null,
                function () {
                    $atr = $this->atr;
                    if (! $atr) {
                        return [
                            'items' => [],
                            'total_amount' => 0,
                        ];
                    }
                    $atr->loadMissing('items');

                    return [
                        'items' => $atr->items->where('parent_item_id', null)->map(fn (\App\Models\ReimbursementItem $item): array => [
                            'id' => $item->id,
                            'item_name' => $item->item_name,
                            'quantity' => $item->quantity,
                            'unit_price' => (float) $item->unit_price,
                            'amount' => (float) $item->amount,
                            'expense_type' => $item->expense_type?->value,
                            'notes' => $item->notes,
                            'activity_name' => $item->budgetDetail?->item_name ?? $item->budgetDetail?->notes ?? '-',
                            'activity_id' => $item->project_budget_detail_id,
                        ])->values(),
                        'total_amount' => (float) $atr->amount,
                    ];
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
        $isHrRole = $user->hasRole('hr');

        // If user is ONLY a Head (not Finance/Direktur), check assignment or creator
        if ($isHeadRole && ! $isFinanceRole && ! $isDirekturRole && ! $isHrRole) {
            $isAssigned = $this->approvals->where('approver_id', $user->id)->where('role', 'head')->isNotEmpty();
            if (! $isAssigned && ! $isCreator) {
                return false;
            }
        }

        // If user is the creator but NOT a head/finance/direktur/hr, they definitely can't approve
        if ($isCreator && ! $isHeadRole && ! $isFinanceRole && ! $isDirekturRole && ! $isHrRole) {
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
        if (in_array($effectiveStage, ['submitted', 'revised']) && ($user->hasRole('head') || $user->hasRole('direktur'))) {
            $pendingHead = $this->approvals->where('role', 'head')->where('status', 'pending')->isNotEmpty();
            if ($pendingHead) {
                return true;
            }
        }

        // 2. HR Approval Phase (Allowance only)
        if ($effectiveStage === 'head_approved' && $this->type->value === 'allowance' && ($user->hasRole('hr') || $user->hasRole('direktur'))) {
            $pendingHR = $this->approvals->where('role', 'hr')->where('status', 'pending')->isNotEmpty();
            if ($pendingHR) {
                return true;
            }
        }

        // 3. Finance Approval Phase
        // For ATR: after Head. For Allowance: after HR.
        $financeStage = (in_array($this->type->value, ['atr', 'eer'])) ? 'head_approved' : 'hr_approved';
        if (in_array($effectiveStage, [$financeStage, 'finance_approved']) && ($user->hasRole('finance') || $user->hasRole('direktur'))) {
            $pendingFinance = $this->approvals->where('role', 'finance')->where('status', 'pending')->isNotEmpty();
            if ($pendingFinance) {
                return true;
            }
        }

        // 4. Direktur Final Phase (After Finance)
        // For Allowance, HR is the final phase before transfer.
        if ($this->type->value === 'allowance' && ($hrApproval && $hrApproval->status->value === 'approved')) {
            // Once HR approved, it's ready for transfer. HR or Admin can take action.
            if ($user->hasRole('hr')) {
                return true;
            }

            return (bool) $user->hasRole('superadmin') || $user->hasRole('direktur');
        }

        $financeApproved = $financeApproval && $financeApproval->status->value === 'approved';

        // Direktur can always approve if finance is done and it's not final yet
        return $financeApproved && $user->hasRole('direktur');
    }
}
