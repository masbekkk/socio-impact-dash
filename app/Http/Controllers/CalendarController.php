<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

final class CalendarController
{
    public function index()
    {
        return Inertia::render('Calendar/Index');
    }
}
