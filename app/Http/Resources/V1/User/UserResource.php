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
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'employee_type' => $this->employee_type,
            'contract_start' => $this->contract_start ? $this->contract_start->toDateString() : null,
            'contract_end' => $this->contract_end ? $this->contract_end->toDateString() : null,
            'roles' => $this->whenLoaded('roles', function () {
                return $this->roles->pluck('name');
            }),
            'status' => 'active', // Placeholder if no status column physically exists
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
