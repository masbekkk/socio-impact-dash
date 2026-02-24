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
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
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
            'creator' => $this->whenLoaded('creator', fn () => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
            ]),
            'division' => $this->whenLoaded('division', fn () => [
                'id' => $this->division->id,
                'name' => $this->division->name,
            ]),
            'account_manager' => $this->whenLoaded('accountManager', fn () => [
                'id' => $this->accountManager->id,
                'name' => $this->accountManager->name,
            ]),
            'head' => $this->whenLoaded('head', fn () => [
                'id' => $this->head->id,
                'name' => $this->head->name,
            ]),
            'pic' => $this->whenLoaded('pic', fn () => [
                'id' => $this->pic->id,
                'name' => $this->pic->name,
            ]),
            'locations' => $this->whenLoaded('locations'),
            'documents' => $this->whenLoaded('documents'),
            'supporting_docs' => $this->whenLoaded('documents'),
            'termin_payments' => $this->whenLoaded('terminPayments'),
            'budget_details' => $this->whenLoaded('budgetDetails'),
            'monitorings' => $this->whenLoaded('monitorings'),
            'monitoring_history' => $this->whenLoaded('monitorings'),
            'approvals' => ProjectApprovalResource::collection($this->whenLoaded('approvals')),
            'events' => $this->whenLoaded('events'),
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
