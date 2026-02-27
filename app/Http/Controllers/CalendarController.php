<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

final class CalendarController
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('Calendar/Index');
    }

    public function show(string $date): \Inertia\Response
    {
        // In real app, you would:
        // 1. Validate the date format
        // 2. Fetch events for this specific date from database
        // 3. Pass the date and events to the view

        return Inertia::render('Calendar/Show', [
            'selectedDate' => $date,
            // 'events' => Event::whereDate('date', $date)->get(),
        ]);
    }
}
