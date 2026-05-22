<?php

declare(strict_types=1);

namespace App\Actions\Calendar;

use App\Enums\UserRole;
use App\Models\Project;
use App\Models\ProjectEvent;
use App\Models\User;
use Illuminate\Support\Collection;

final readonly class GetCalendarEvents
{
    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function handle(User $user): Collection
    {
        $projectsQuery = Project::query();
        $eventsQuery = ProjectEvent::query();

        // 1. Role-Based Visibility Filters
        if ($user->hasRole([UserRole::Superadmin->value, UserRole::Direktur->value, UserRole::Finance->value, UserRole::HR->value])) {
            // Can see all
        } elseif ($user->hasRole(UserRole::Head->value)) {
            $divisionId = $user->division_id;

            $projectsQuery->where(function ($q) use ($user, $divisionId): void {
                $q->where('created_by', $user->id)
                    ->orWhere('pic_id', $user->id)
                    ->orWhere('account_manager_id', $user->id)
                    ->orWhere('head_id', $user->id)
                    ->orWhere('division_id', $divisionId);
            });

            $visibleProjectIds = $projectsQuery->pluck('id');
            $eventsQuery->where(function ($q) use ($user, $visibleProjectIds): void {
                $q->whereIn('project_id', $visibleProjectIds)
                    ->orWhere('created_by', $user->id)
                    ->orWhereHas('attendees', function ($query) use ($user): void {
                        $query->where('users.id', $user->id);
                    });
            });
        } else {
            // PEGAWAI
            $projectsQuery->where(function ($q) use ($user): void {
                $q->where('created_by', $user->id)
                    ->orWhere('pic_id', $user->id)
                    ->orWhere('account_manager_id', $user->id);
            });

            $visibleProjectIds = $projectsQuery->pluck('id');
            $eventsQuery->where(function ($q) use ($user, $visibleProjectIds): void {
                $q->whereIn('project_id', $visibleProjectIds)
                    ->orWhere('created_by', $user->id)
                    ->orWhereHas('attendees', function ($query) use ($user): void {
                        $query->where('users.id', $user->id);
                    });
            });
        }

        // 2. Fetch Data
        // Only fetch events for the simplified view
        $events = $eventsQuery->with(['project:id,name', 'attendees:id,name', 'creator:id,name'])->get();

        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $calendarEvents */
        $calendarEvents = collect();

        // 3. Map to Standardized DTO array
        foreach ($events as $event) {
            $titlePrefix = ($event->project_id && $event->project) ? 'Event ('.(string) $event->project->name.'): ' : '';
            $calendarEvents->push([
                'id' => 'event_'.$event->id,
                'title' => $titlePrefix.$event->name,
                'date' => $event->start_date->format('Y-m-d'),
                'endDate' => $event->end_date ? $event->end_date->format('Y-m-d') : null,
                'type' => 'event',
                'description' => $event->notes,
                'project_name' => $event->project?->name,
                'allDay' => true,
                'attendees' => $event->attendees->map(fn ($u) => ['id' => $u->id, 'name' => $u->name])->toArray(),
                'creator_name' => $event->creator->name ?? null,
            ]);
        }

        return $calendarEvents;
    }
}
