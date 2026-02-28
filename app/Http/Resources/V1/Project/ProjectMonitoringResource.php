<?php

declare(strict_types=1);

namespace App\Http\Resources\V1\Project;

use Illuminate\Http\Resources\Json\JsonResource;

final class ProjectMonitoringResource extends JsonResource
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
            'report_date' => $this->report_date,
            'notes' => $this->notes,
            'creator' => $this->whenLoaded('creator', fn () => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
            ]),
            'documents' => $this->whenLoaded('documents'),
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
