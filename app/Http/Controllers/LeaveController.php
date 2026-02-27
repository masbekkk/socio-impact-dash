<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeaveRequest;
use App\Http\Requests\UpdateLeaveRequest;
use App\Models\Leave;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

final class LeaveController
{
    /**
     * Display a listing of the resource.
     */
    public function index(): \Inertia\Response
    {
        return Inertia::render('Leave/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): \Inertia\Response
    {
        return Inertia::render('Leave/CreateLeave', $this->getFormProps($request));
    }

    /**
     * Show the form for creating a new travel request.
     */
    public function createTravel(Request $request): \Inertia\Response
    {
        return Inertia::render('Leave/CreateTravel', $this->getFormProps($request));
    }

    public function approvals(): \Inertia\Response
    {
        return Inertia::render('Leave/Index');
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeaveRequest $request): void
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code): \Inertia\Response
    {
        $user = Auth::user();

        return Inertia::render('Leave/Show', [
            'leaveCode' => $code,
            'authUser'  => [
                'id'          => $user->id,
                'can_approve' => $user->can('approve_leaves'),
                'can_reject'  => $user->can('reject_leaves'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Leave $leave): void
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeaveRequest $request, Leave $leave): void
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Leave $leave): void
    {
        //
    }

    private function getFormProps(Request $request): array
    {
        $user = $request->user();
        $user->load('division');

        $projects = Project::where('status', 'active')
            ->get(['id', 'code', 'name']);

        $users = User::where('id', '!=', $user->id)
            ->get(['id', 'name', 'email']);

        return [
            'authUser' => [
                'name'          => $user->name,
                'nip'           => $user->nip ?? '-',
                'email'         => $user->email,
                'division_name' => $user->division?->name ?? '-',
                'position'      => $user->getRoleNames()->first() ?? '-',
                'join_date'     => $user->created_at?->format('Y-m-d') ?? '-',
            ],
            'projects' => $projects,
            'users'    => $users,
        ];
    }
}
