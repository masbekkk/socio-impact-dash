<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;

final class DivisionController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/divisions/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/divisions/create');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Inertia::render('admin/divisions/edit', [
            'divisionId' => $id,
        ]);
    }
}
