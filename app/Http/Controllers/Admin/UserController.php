<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;

final class UserController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('user/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Users/Create');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('Users/Edit', [
            'userId' => $id,
        ]);
    }
}
