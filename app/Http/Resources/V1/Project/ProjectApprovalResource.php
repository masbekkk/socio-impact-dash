<?php

declare(strict_types=1);

namespace App\Http\Resources\V1\Project;

use Illuminate\Http\Resources\Json\JsonResource;

final class ProjectApprovalResource extends JsonResource
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
            'approval_type' => $this->approval_type,
            'approval_status' => $this->approval_status,
            'notes' => $this->notes,
            'approved_by' => $this->whenLoaded('approvedBy', fn() => [
                'id' => $this->approvedBy->id,
                'name' => $this->approvedBy->name,
                'role' => $this->approvedBy->getRoleNames()->first(),
            ]),
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
