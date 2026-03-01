<?php

declare(strict_types=1);

namespace App\Actions\Calendar;

use App\Models\ProjectEvent;
use Illuminate\Support\Facades\Gate;

final readonly class DeleteCalendarEvent
{
    public function handle(int $id): bool
    {
        /** @var ProjectEvent $event */
        $event = ProjectEvent::findOrFail($id);

        Gate::authorize('delete', $event);

        return $event->delete();
    }
}
