<?php

declare(strict_types=1);

namespace App\Actions\Calendar;

use App\Models\ProjectEvent;
use Illuminate\Support\Facades\DB;

final readonly class CreateCalendarEvent
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data): ProjectEvent
    {
        return DB::transaction(function () use ($data): ProjectEvent {
            /** @var ProjectEvent $event */
            $event = ProjectEvent::query()->create([
                'project_id' => empty($data['project_id']) ? null : $data['project_id'],
                'created_by' => auth()->id(),
                'name' => $data['name'],
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            if (! empty($data['user_ids'])) {
                /** @var array<int> $userIds */
                $userIds = $data['user_ids'];
                $event->attendees()->sync($userIds);

                $notifier = new \App\Actions\CreateNotification();
                $creator = auth()->user();
                $creatorName = $creator instanceof \App\Models\User ? $creator->name : 'Seseorang';

                $notifier->handle(
                    type: 'calendar_event_invited',
                    title: 'Undangan Agenda Baru',
                    message: "Anda telah diundang ke agenda \"{$event->name}\" oleh {$creatorName}.",
                    recipientUserIds: $userIds,
                    referenceType: 'project_event',
                    referenceId: $event->id,
                    createdBy: auth()->id() ? (int) auth()->id() : null,
                );
            }

            return $event;
        });
    }
}
