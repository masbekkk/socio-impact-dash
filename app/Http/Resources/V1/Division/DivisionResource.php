<?php

declare(strict_types=1);

namespace App\Http\Resources\V1\Division;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read string $code
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Division> $divisions
 * @property-read \Carbon\CarbonInterface $created_at
 * @property-read \Carbon\CarbonInterface $updated_at
 */
final class DivisionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var \App\Models\DivisionCode $this */
        $this->loadMissing('divisions');
        
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'names' => $this->divisions->map(fn (\App\Models\Division $div) => [
                'id' => $div->id,
                'name' => $div->name,
                'description' => $div->description,
            ])->toArray(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
