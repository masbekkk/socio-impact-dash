<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LetterCodeController extends Controller
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
