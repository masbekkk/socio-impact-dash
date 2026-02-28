<?php

declare(strict_types=1);

namespace App\Actions\Calendar;

use App\Enums\UserRole;
use App\Models\Leave;
use App\Models\Project;
use App\Models\ProjectEvent;
use App\Models\ProjectMonitoring;
use App\Models\User;
use Illuminate\Support\Collection;

final readonly class GetCalendarEvents
{
    public function handle(User $user): Collection
    {
        $projectsQuery = Project::query();
        $leavesQuery = Leave::query();
        $monitoringsQuery = ProjectMonitoring::query();
        $eventsQuery = ProjectEvent::query();

        // 1. Role-Based Visibility Filters
        if ($user->hasRole([UserRole::Superadmin->value, UserRole::Direktur->value, UserRole::Finance->value, UserRole::HR->value])) {
            // Can see all
        } elseif ($user->hasRole(UserRole::Head->value)) {
            $divisionId = $user->division_id;
            
            $projectsQuery->where(function ($q) use ($user, $divisionId) {
                $q->where('created_by', $user->id)
                  ->orWhere('pic_id', $user->id)
                  ->orWhere('account_manager_id', $user->id)
                  ->orWhere('head_id', $user->id)
                  ->orWhere('division_id', $divisionId);
            });
            
            // Assume HEAD can see leaves within their division or created by themselves
            $leavesQuery->whereHas('user', function ($q) use ($divisionId, $user) {
                $q->where('division_id', $divisionId)
                  ->orWhere('id', $user->id);
            });
            
            // Monitorings linked to visible projects
            $visibleProjectIds = (clone $projectsQuery)->select('id');
            $monitoringsQuery->whereIn('project_id', $visibleProjectIds);
            
            // Events linked to visible projects or created by them (general events)
            $eventsQuery->where(function ($q) use ($user, $visibleProjectIds) {
                $q->whereIn('project_id', $visibleProjectIds)
                  ->orWhere('created_by', $user->id);
            });

        } else {
            // PEGAWAI
            $projectsQuery->where(function ($q) use ($user) {
                $q->where('created_by', $user->id)
                  ->orWhere('pic_id', $user->id)
                  ->orWhere('account_manager_id', $user->id);
            });
            
            $leavesQuery->where('user_id', $user->id);
            
            $visibleProjectIds = (clone $projectsQuery)->select('id');
            $monitoringsQuery->where(function($q) use ($user, $visibleProjectIds) {
                $q->whereIn('project_id', $visibleProjectIds)
                  ->orWhere('created_by', $user->id);
            });
                             
            $eventsQuery->where(function ($q) use ($user, $visibleProjectIds) {
                $q->whereIn('project_id', $visibleProjectIds)
                  ->orWhere('created_by', $user->id);
            });
        }

        // 2. Fetch Data
        // Select only necessary columns to keep memory low
        $projects = $projectsQuery->get(['id', 'name', 'start_date', 'end_date', 'code']);
        $leaves = $leavesQuery->with('user:id,name')->get(['id', 'user_id', 'start_date', 'end_date', 'type']);
        $monitorings = $monitoringsQuery->with('project:id,name')->get(['id', 'project_id', 'report_date', 'notes']);
        $events = $eventsQuery->with('project:id,name')->get(['id', 'name', 'start_date', 'end_date', 'project_id']);

        $calendarEvents = collect();

        // 3. Map to Standardized DTO array: [id, title, date, endDate, type, routeInfo, ...]
        foreach ($projects as $project) {
            if ($project->start_date) {
                $calendarEvents->push([
                    'id' => 'project_' . $project->id,
                    'title' => $project->name,
                    'date' => $project->start_date->format('Y-m-d'),
                    'endDate' => $project->end_date ? $project->end_date->format('Y-m-d') : null,
                    'type' => 'project',
                    'description' => "Project: {$project->code}",
                    'allDay' => true,
                    'route' => route('projects.show', $project->id, false),
                ]);
            }
        }

        foreach ($leaves as $leave) {
            if ($leave->start_date) {
                $calendarEvents->push([
                    'id' => 'leave_' . $leave->id,
                    'title' => 'Cuti: ' . ($leave->user->name ?? 'Unknown'),
                    'date' => $leave->start_date->format('Y-m-d'),
                    'endDate' => $leave->end_date ? $leave->end_date->format('Y-m-d') : null,
                    'type' => 'leave',
                    'description' => "Jenis: {$leave->type->label()}",
                    'allDay' => true,
                ]);
            }
        }

        foreach ($monitorings as $monitoring) {
            if ($monitoring->report_date) {
                $calendarEvents->push([
                    'id' => 'monitoring_' . $monitoring->id,
                    'title' => 'Monitoring: ' . ($monitoring->project->name ?? 'Project'),
                    'date' => substr($monitoring->report_date, 0, 10), // Report date might be datetime
                    'type' => 'monitoring',
                    'description' => $monitoring->notes ?? '',
                    'allDay' => true,
                    'route' => route('projects.show', $monitoring->project_id, false) . '?tab=monitoring',
                ]);
            }
        }

        foreach ($events as $event) {
            if ($event->start_date) {
                $titlePrefix = $event->project_id ? "Event ({$event->project->name}): " : '';
                $calendarEvents->push([
                    'id' => 'event_' . $event->id,
                    'title' => $titlePrefix . $event->name,
                    'date' => $event->start_date->format('Y-m-d'),
                    'endDate' => $event->end_date ? $event->end_date->format('Y-m-d') : null,
                    'type' => 'event',
                    'allDay' => true,
                ]);
            }
        }

        return $calendarEvents;
    }
}
