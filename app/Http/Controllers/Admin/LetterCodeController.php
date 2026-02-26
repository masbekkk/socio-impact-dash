<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

final class LetterCodeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/letter-codes/index');
    }

    public function create(): Response
    {
        return Inertia::render('admin/letter-codes/create');
    }

    public function edit(string $id): Response
    {
        return Inertia::render('admin/letter-codes/edit', ['letterCodeId' => $id]);
    }
}
