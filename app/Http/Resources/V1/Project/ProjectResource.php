<?php

declare(strict_types=1);

namespace App\Http\Resources\V1\Project;

use App\Actions\GetProjectAtrUsage;
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
        $atrUsage = collect(app(GetProjectAtrUsage::class)->handle($this->resource));
        $pendingAtrs = $atrUsage->where('converted', false);
        $convertedAtrs = $atrUsage->where('converted', true);
        $pendingAtr = (float) $pendingAtrs->sum('amount');
        $projectAtrRecords = fn ($records) => $records->map(fn ($record): array => [
            'id' => $record['id'],
            'code' => $record['code'],
            'amount' => $record['amount'],
            'requested_amount' => $record['requested_amount'],
        ])->values()->all();
        $usedEer = (float) $this->reimbursements()
            ->where('type', 'eer')
            ->whereNotIn('status', ['rejected', 'draft'])
            ->sum('amount');

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
            'budget_details' => $this->whenLoaded('budgetDetails', fn () => $this->budgetDetails->map(function ($detail) use ($atrUsage): array {
                $activityAtrs = $atrUsage->filter(fn ($record): bool => array_key_exists($detail->id, $record['allocations']));
                $pending = $activityAtrs->where('converted', false);
                $converted = $activityAtrs->where('converted', true);
                $atrTotal = fn ($records): ?float => $records->contains(fn ($record): bool => $record['allocations'][$detail->id] === null)
                    ? null : (float) $records->sum(fn ($record) => $record['allocations'][$detail->id]);
                $atrRecords = fn ($records) => $records->map(fn ($record): array => [
                    'id' => $record['id'],
                    'code' => $record['code'],
                    'amount' => $record['allocations'][$detail->id],
                    'requested_amount' => $record['requested_allocations'][$detail->id],
                ])->values()->all();
                $eerItems = $detail->reimbursementItems()
                    ->whereHas('reimbursement', function ($q) {
                        $q->where('type', 'eer')->whereNotIn('status', ['rejected', 'draft']);
                    })
                    ->with('reimbursement:id,code')
                    ->get();
                $records = fn ($items) => $items->groupBy('reimbursement_id')->map(fn ($group): array => [
                    'id' => $group->first()->reimbursement_id,
                    'code' => $group->first()->reimbursement?->code,
                    'amount' => (float) $group->sum('amount'),
                ])->values()->all();

                return [
                    'id' => $detail->id,
                    'item_name' => $detail->item_name,
                    'quantity' => $detail->quantity,
                    'item_price' => $detail->item_price,
                    'amount' => $detail->amount,
                    'amount_pelaksanaan' => $detail->amount_pelaksanaan,
                    'amount_proposal' => $detail->amount_proposal,
                    'notes' => $detail->notes,
                    'used_atr' => $atrTotal($activityAtrs),
                    'pending_atr' => $atrTotal($pending),
                    'requested_pending_atr' => (float) $pending->sum(fn ($record) => $record['requested_allocations'][$detail->id]),
                    'requested_atr' => (float) $activityAtrs->sum(fn ($record) => $record['requested_allocations'][$detail->id]),
                    'used_eer' => (float) $eerItems->sum('amount'),
                    'atr_records' => $atrRecords($pending),
                    'converted_atr_records' => $atrRecords($converted),
                    'eer_records' => $records($eerItems),
                ];
            })),
            'year_claims' => $this->whenLoaded('yearClaims', fn () => $this->yearClaims->map(fn ($claim): array => [
                'id' => $claim->id,
                'year' => $claim->year,
                'amount' => (float) $claim->amount,
            ])),
            'monitorings' => ProjectMonitoringResource::collection($this->whenLoaded('monitorings')),
            'monitoring_history' => ProjectMonitoringResource::collection($this->whenLoaded('monitorings')),
            'approvals' => ProjectApprovalResource::collection($this->whenLoaded('approvals')),
            'events' => $this->whenLoaded('events'),
            'used_atr' => (float) $atrUsage->sum('amount'),
            'atr_records' => $projectAtrRecords($pendingAtrs),
            'converted_atr_records' => $projectAtrRecords($convertedAtrs),
            'atr_allocation_pending' => $atrUsage->contains('allocation_pending', true),
            'pending_atr' => $pendingAtr,
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
            'used_eer' => $usedEer,
            'used_allowance' => (float) $this->reimbursements()
                ->where('type', 'allowance')
                ->whereNotIn('status', ['rejected', 'draft', 'revision'])
                ->sum('amount'),
            'total_used_operational' => $pendingAtr + $usedEer,
            'remaining_operational' => (float) $this->operational_budget - $pendingAtr - $usedEer,
            'remaining_allowance' => (float) $this->allowance_budget - (float) $this->reimbursements()
                ->where('type', 'allowance')
                ->whereNotIn('status', ['rejected', 'draft', 'revision'])
                ->sum('amount'),
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
