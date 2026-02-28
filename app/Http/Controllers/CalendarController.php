<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Calendar\CreateCalendarEvent;
use App\Actions\Calendar\GetCalendarEvents;
use Illuminate\Http\Request;
use Inertia\Inertia;

final class CalendarController
{
    public function index(GetCalendarEvents $getCalendarEvents): \Inertia\Response
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        $events = $getCalendarEvents->handle($user);

        $isExecutive = $user->hasRole([\App\Enums\UserRole::Superadmin->value, \App\Enums\UserRole::Direktur->value, \App\Enums\UserRole::Finance->value, \App\Enums\UserRole::HR->value]);
        $isHead = $user->hasRole(\App\Enums\UserRole::Head->value);

        return Inertia::render('Calendar/Index', [
            'events' => $events,
            // Also send projects for the dropdown in "Create Event" modal
            'projects' => $isExecutive
                ? \App\Models\Project::select('id', 'name')->orderBy('name')->get()
                : ($isHead
                    ? \App\Models\Project::where('division_id', $user->division_id)->orWhere('created_by', $user->id)->select('id', 'name')->orderBy('name')->get()
                    : \App\Models\Project::where('created_by', $user->id)->select('id', 'name')->orderBy('name')->get())
        ]);
    }

    public function store(Request $request, CreateCalendarEvent $createCalendarEvent): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'notes' => ['nullable', 'string'],
        ]);

        $createCalendarEvent->handle($validated);

        return back()->with('success', 'Agenda berhasil ditambahkan.');
    }

    public function show(string $date): \Inertia\Response
    {
        // For backwards compatibility or specific day view if needed.
        return Inertia::render('Calendar/Show', [
            'selectedDate' => $date,
        ]);
    }
}
