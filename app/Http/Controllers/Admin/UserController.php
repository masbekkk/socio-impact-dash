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
        // Dummy data for users management
        $users = [
            [
                'id' => 1,
                'name' => 'Admin User',
                'email' => 'admin@socio-impact.test',
                'role' => 'superadmin',
                'avatar' => null,
                'status' => 'active',
                'created_at' => '2026-01-30T10:00:00.000000Z',
            ],
            [
                'id' => 2,
                'name' => 'Department Head',
                'email' => 'head@socio-impact.test',
                'role' => 'head',
                'avatar' => null,
                'status' => 'active',
                'created_at' => '2026-01-31T09:30:00.000000Z',
            ],
            [
                'id' => 3,
                'name' => 'Finance Officer',
                'email' => 'finance@socio-impact.test',
                'role' => 'finance',
                'avatar' => null,
                'status' => 'active',
                'created_at' => '2026-02-01T14:15:00.000000Z',
            ],
            [
                'id' => 4,
                'name' => 'Pegawai 1',
                'email' => 'pegawai1@socio-impact.test',
                'role' => 'pegawai',
                'avatar' => null,
                'status' => 'active',
                'created_at' => '2026-02-02T08:00:00.000000Z',
            ],
            [
                'id' => 5,
                'name' => 'Pegawai 2',
                'email' => 'pegawai2@socio-impact.test',
                'role' => 'pegawai',
                'avatar' => null,
                'status' => 'inactive',
                'created_at' => '2026-02-03T11:45:00.000000Z',
            ],
        ];

        return Inertia::render('user/index', [
            'users' => $users
        ]);
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
        // Dummy data for edit
        $user = [
            'id' => $id,
            'name' => 'Dummy User',
            'email' => 'dummy@example.com',
            'role' => 'pegawai',
        ];

        return Inertia::render('Users/Edit', [
            'user' => $user
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
