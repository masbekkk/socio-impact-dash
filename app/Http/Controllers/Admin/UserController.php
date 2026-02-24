<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Logic to store user (without auto-login)
        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('Users/Edit', [
            'userId' => $id
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Logic to update user
        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Logic to delete user (without logging out admin)
        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }
}
