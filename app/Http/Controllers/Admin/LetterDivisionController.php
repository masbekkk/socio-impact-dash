<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

final class LetterDivisionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/letter-divisions/index');
    }

    public function create(): Response
    {
        return Inertia::render('admin/letter-divisions/create');
    }

    public function edit(string $id): Response
    {
        return Inertia::render('admin/letter-divisions/edit', ['letterDivisionId' => $id]);
    }
}
