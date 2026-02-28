<?php

declare(strict_types=1);

namespace App\Actions\Calendar;

use App\Models\ProjectEvent;

final readonly class CreateCalendarEvent
{
    public function handle(array $data): ProjectEvent
    {
        return ProjectEvent::create([
            'project_id' => $data['project_id'] ?? null,
            'created_by' => auth()->id(),
            'name' => $data['name'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'] ?? null,
            'notes' => $data['notes'] ?? null,
        ]);
    }
}
