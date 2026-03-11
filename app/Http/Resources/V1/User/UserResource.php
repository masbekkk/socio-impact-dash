<?php

declare(strict_types=1);

namespace App\Http\Resources\V1\User;

use Illuminate\Http\Resources\Json\JsonResource;

final class UserResource extends JsonResource
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
            'name' => $this->name,
            'position' => $this->position,
            'email' => $this->email,
            'nip' => $this->nip,
            'division_id' => $this->division_id,
            'head_id' => $this->head_id,
            'head' => $this->whenLoaded('head', fn (): ?array => $this->head ? [
                'id' => $this->head->id,
                'name' => $this->head->name,
                'email' => $this->head->email,
            ] : null),
            'team_members_count' => $this->whenCounted('teamMembers'),
            'employee_type' => $this->employee_type,
            'contract_start' => $this->contract_start ? $this->contract_start->toDateString() : null,
            'contract_end' => $this->contract_end ? $this->contract_end->toDateString() : null,
            'roles' => $this->whenLoaded('roles', fn () => $this->roles->pluck('name')),
            'division' => $this->whenLoaded('division', fn (): ?array => $this->division ? [
                'id' => $this->division->id,
                'name' => $this->division->name,
                'division_code' => $this->division->divisionCode ? [
                    'id' => $this->division->divisionCode->id,
                    'code' => $this->division->divisionCode->code,
                ] : null,
            ] : null),
            'status' => 'active', // Placeholder if no status column physically exists
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
