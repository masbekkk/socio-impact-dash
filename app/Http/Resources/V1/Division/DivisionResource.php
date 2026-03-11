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
        /** @var \App\Models\Division $this */
        $this->loadMissing('divisionCode');

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'division_code' => $this->whenLoaded('divisionCode', fn (): array => [
                'id' => $this->divisionCode->id,
                'code' => $this->divisionCode->code,
                'name' => $this->divisionCode->name,
            ]),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
