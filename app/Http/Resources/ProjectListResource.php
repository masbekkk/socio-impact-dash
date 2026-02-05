<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class ProjectListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'code' => $this->code,
            'name' => $this->name,
            'slug' => Str::slug($this->name),
            'client' => $this->client,
            'division_code' => $this->division?->code ?? null,
            'division_name' => $this->division?->name ?? null,
            'status' => $this->status?->value ?? $this->status,
            'budget_total' => (float) $this->budget_total,
            'sow' => $this->sow_path,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'team' => [
                'am' => $this->accountManager?->name ?? '-',
                'head' => $this->head?->name ?? '-',
                'pic' => $this->pic?->name ?? '-',
            ],
            'issues' => ProjectIssueResource::collection($this->whenLoaded('issues')),
            'monitoring_history' => MonitoringHistoryResource::collection($this->whenLoaded('milestones')),
        ];
    }
}

