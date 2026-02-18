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
            'approvals' => $this->whenLoaded('approvals'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
