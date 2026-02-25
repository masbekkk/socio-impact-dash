<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LetterDivisionController extends Controller
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
