<?php

declare(strict_types=1);

namespace App\Http\Resources\V1\Project;

use Illuminate\Http\Resources\Json\JsonResource;

final class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(\Illuminate\Http\Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'code' => $this->code,
            'name' => $this->name,
            'client_name' => $this->client_name,
            'initial_project' => $this->initial_project,
            'description' => $this->description,
            'status' => $this->status,
            'project_type' => $this->project_type,
            'budget_total' => (float) $this->budget_total,
            'operational_budget' => (float) $this->operational_budget,
            'management_budget' => (float) $this->management_budget,
            'allowance_budget' => (float) $this->allowance_budget,
            'budget_partition_status' => $this->budget_partition_status,
            'start_date' => $this->start_date ? $this->start_date->toDateString() : null,
            'end_date' => $this->end_date ? $this->end_date->toDateString() : null,
            'division_id' => $this->division_id,
            'account_manager_id' => $this->account_manager_id,
            'head_id' => $this->head_id,
            'pic_id' => $this->pic_id,
            'created_by' => $this->created_by,
            'actual_budget' => $this->actual_budget,
            'lesson_learned' => $this->lesson_learned,
            'creator' => $this->whenLoaded('creator', fn (): array => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
            ]),
            'division' => $this->whenLoaded('division', fn (): array => [
                'id' => $this->division->id,
                'name' => $this->division->name,
                'code' => $this->division->divisionCode?->code,
            ]),
            'account_manager' => $this->whenLoaded('accountManager', fn (): array => [
                'id' => $this->accountManager->id,
                'name' => $this->accountManager->name,
                'email' => $this->accountManager->email,
            ]),
            'head' => $this->whenLoaded('head', fn (): array => [
                'id' => $this->head->id,
                'name' => $this->head->name,
                'email' => $this->head->email,
            ]),
            'pic' => $this->whenLoaded('pic', fn (): array => [
                'id' => $this->pic->id,
                'name' => $this->pic->name,
                'email' => $this->pic->email,
            ]),
            'locations' => $this->whenLoaded('locations'),
            'documents' => $this->whenLoaded('documents', fn () => $this->documents->map(fn ($doc): array => [
                'id' => $doc->id,
                'type' => $doc->type,
                'original_name' => $doc->original_name,
                'path' => $doc->path,
                'mime' => $doc->mime,
                'size' => $doc->size,
                'url' => $doc->url,
                'upload_status' => $doc->upload_status ?? 'completed',
            ])),
            'supporting_docs' => $this->whenLoaded('documents', fn () => $this->documents->map(fn ($doc): array => [
                'id' => $doc->id,
                'type' => $doc->type,
                'original_name' => $doc->original_name,
                'path' => $doc->path,
                'mime' => $doc->mime,
                'size' => $doc->size,
                'url' => $doc->url,
                'upload_status' => $doc->upload_status ?? 'completed',
            ])),
            'termin_payments' => $this->whenLoaded('terminPayments'),
            'budget_details' => $this->whenLoaded('budgetDetails', fn () => $this->budgetDetails->map(fn ($detail): array => [
                'id' => $detail->id,
                'item_name' => $detail->item_name,
                'quantity' => $detail->quantity,
                'item_price' => $detail->item_price,
                'amount' => $detail->amount,
                'amount_pelaksanaan' => $detail->amount_pelaksanaan,
                'amount_proposal' => $detail->amount_proposal,
                'notes' => $detail->notes,
                'used_atr' => (float) $detail->reimbursementItems()
                    ->whereHas('reimbursement', function ($q) {
                        $q->where('type', 'atr')->whereNotIn('status', ['rejected', 'draft']);
                    })
                    ->whereNull('parent_item_id')
                    ->sum('amount'),
                'used_eer' => (float) $detail->reimbursementItems()
                    ->whereHas('reimbursement', function ($q) {
                        $q->where('type', 'eer')->whereNotIn('status', ['rejected', 'draft']);
                    })
                    ->sum('amount'),
            ])),
            'year_claims' => $this->whenLoaded('yearClaims', fn () => $this->yearClaims->map(fn ($claim): array => [
                'id' => $claim->id,
                'year' => $claim->year,
                'amount' => (float) $claim->amount,
            ])),
            'monitorings' => ProjectMonitoringResource::collection($this->whenLoaded('monitorings')),
            'monitoring_history' => ProjectMonitoringResource::collection($this->whenLoaded('monitorings')),
            'approvals' => ProjectApprovalResource::collection($this->whenLoaded('approvals')),
            'events' => $this->whenLoaded('events'),
            'used_atr' => (float) $this->reimbursements()
                ->where('type', 'atr')
                ->whereNotIn('status', ['rejected', 'draft'])
                ->sum('amount'),
            'used_eer_refund' => (float) $this->reimbursements()
                ->where('type', 'eer')
                ->where('eer_type', 'refund')
                ->whereNotIn('status', ['rejected', 'draft'])
                ->sum('amount'),
            'used_eer_reimbursement' => (float) $this->reimbursements()
                ->where('type', 'eer')
                ->where('eer_type', 'reimbursement')
                ->whereNotIn('status', ['rejected', 'draft'])
                ->sum('amount'),
            'used_eer' => (float) $this->reimbursements()
                ->where('type', 'eer')
                ->whereNotIn('status', ['rejected', 'draft'])
                ->sum('amount'),
            'used_allowance' => (float) $this->reimbursements()
                ->where('type', 'allowance')
                ->whereNotIn('status', ['rejected', 'draft', 'revision'])
                ->sum('amount'),
            'total_used_operational' => (float) $this->reimbursements()
                ->where('type', 'atr')
                ->whereNotIn('status', ['rejected', 'draft'])
                ->sum('amount')
                + (float) $this->reimbursements()
                    ->where('type', 'eer')
                    ->where('eer_type', 'reimbursement')
                    ->whereNotIn('status', ['rejected', 'draft'])
                    ->sum('amount')
                - (float) $this->reimbursements()
                    ->where('type', 'eer')
                    ->where('eer_type', 'refund')
                    ->whereNotIn('status', ['rejected', 'draft'])
                    ->sum('amount'),
            'remaining_operational' => (float) $this->operational_budget
                - (float) $this->reimbursements()
                    ->where('type', 'atr')
                    ->whereNotIn('status', ['rejected', 'draft'])
                    ->sum('amount')
                - (float) $this->reimbursements()
                    ->where('type', 'eer')
                    ->where('eer_type', 'reimbursement')
                    ->whereNotIn('status', ['rejected', 'draft'])
                    ->sum('amount')
                + (float) $this->reimbursements()
                    ->where('type', 'eer')
                    ->where('eer_type', 'refund')
                    ->whereNotIn('status', ['rejected', 'draft'])
                    ->sum('amount'),
            'remaining_allowance' => (float) $this->allowance_budget - (float) $this->reimbursements()
                ->where('type', 'allowance')
                ->whereNotIn('status', ['rejected', 'draft', 'revision'])
                ->sum('amount'),
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
