<?php

declare(strict_types=1);

namespace App\Http\Resources\V1\Reimbursement;

use App\Http\Resources\V1\Reimbursement\ReimbursementDocumentResource;
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
            'comments' => $this->whenLoaded('comments', function(): \Illuminate\Support\Collection {
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
            'approvals' => $this->whenLoaded('approvals'),
            'can_approve' => $this->calculateCanApprove($request),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'atr_budget_selecteds' => $this->whenLoaded('atrBudgetSelecteds', function(): \Illuminate\Support\Collection {
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
        if (!$user) {
            return false;
        }

        // Requester cannot approve their own reimbursement
        if ($this->user_id === $user->id) {
            return false;
        }

        // Check if user has already approved/rejected
        $hasActed = $this->approvals->where('approver_id', $user->id)->isNotEmpty();
        if ($hasActed) {
            return false;
        }

        return match ($this->status?->value) {
            'submitted' => $this->project?->head_id === $user->id || $user->hasRole('direktur'),
            'head_approved', 'finance_approved', 'revision' => $user->hasRole('finance') || $user->hasRole('direktur'),
            default => false,
        };
    }
}
