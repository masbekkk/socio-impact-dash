<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class PresenceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date' => $this->date->format('Y-m-d'),
            'status' => $this->status?->value ?? $this->status,
            'check_in_at' => $this->check_in_at?->format('H:i:s'),
            'check_out_at' => $this->check_out_at?->format('H:i:s'),
            'check_in_location' => [
                'latitude' => $this->check_in_latitude,
                'longitude' => $this->check_in_longitude,
            ],
            'check_out_location' => [
                'latitude' => $this->check_out_latitude,
                'longitude' => $this->check_out_longitude,
            ],
            'photo_path' => $this->photo_path,
            'checkout_photo_path' => $this->checkout_photo_path,
            'image_url' => $this->image_url,
            'checkout_image_url' => $this->checkout_image_url,
            'attachment_path' => $this->attachment_path,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
