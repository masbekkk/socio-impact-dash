<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\MilestoneStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MonitoringHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $statusValue = $this->status instanceof MilestoneStatus 
            ? $this->status->value 
            : $this->status;
            
        return [
            'month' => $this->target_date?->format('F Y'),
            'status' => $this->mapStatus($statusValue),
            'notes' => $this->description,
        ];
    }
    
    private function mapStatus(?string $status): string
    {
        return match ($status) {
            'done', 'completed' => 'on_track',
            'in_progress' => 'on_track',
            'planned', 'pending' => 'delayed',
            'cancelled' => 'risk',
            default => 'on_track',
        };
    }
}
