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
            'operational_budget' => (float) $this->budget_total * 0.50,
            'management_budget' => (float) $this->budget_total * 0.30,
            'allowance_budget' => (float) $this->budget_total * 0.20,
            'start_date' => $this->start_date ? $this->start_date->toDateString() : null,
            'end_date' => $this->end_date ? $this->end_date->toDateString() : null,
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
            'monitorings' => $this->whenLoaded('monitorings'),
            'monitoring_history' => $this->whenLoaded('monitorings'),
            'approvals' => $this->whenLoaded('approvals'),
            'events' => $this->whenLoaded('events'),
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
