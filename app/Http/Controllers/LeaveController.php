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
    public function index(Request $request): \Inertia\Response
    {
        $user = $request->user();
        $leaveService = app(\App\Services\LeaveService::class);
        $usedDays = $leaveService->getAnnualLeaveDaysUsed($user->id, (int) date('Y'));
        $remainingAnnualLeaves = max(0, 12 - $usedDays);

        return Inertia::render('Leave/Index', [
            'remainingAnnualLeaves' => $remainingAnnualLeaves,
        ]);
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
    public function show(Request $request, string $code): \Inertia\Response
    {
        $user = Auth::user();
        $leave = Leave::where('code', $code)->firstOrFail();

        $leaveService = app(\App\Services\LeaveService::class);
        $submitterUsedDays = $leaveService->getAnnualLeaveDaysUsed($leave->user_id, (int) date('Y', strtotime($leave->start_date->toDateString())));
        $submitterRemainingLeaves = max(0, 12 - $submitterUsedDays);

        $formProps = $this->getFormProps($request);

        return Inertia::render('Leave/Show', [
            'leaveCode' => $code,
            'authUser' => array_merge($formProps['authUser'], [
                'id' => $user->id,
                'can_approve' => $user->can('approve_leaves'),
                'can_reject' => $user->can('reject_leaves'),
                'can_delete' => $user->hasAnyRole(['hr', 'superadmin']),
                'is_owner' => ! $user->hasAnyRole(['hr', 'superadmin']) && $leave->user_id === $user->id,
            ]),
            'submitterRemainingLeaves' => $submitterRemainingLeaves,
            'projects' => $formProps['projects'],
            'users' => $formProps['users'],
            'approvers' => $formProps['approvers'],
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

        $leaveService = app(\App\Services\LeaveService::class);
        $usedDays = $leaveService->getAnnualLeaveDaysUsed($user->id, (int) date('Y'));
        $remainingAnnualLeaves = max(0, 12 - $usedDays);

        $approvers = [
            'head' => User::role('head')->get(['id', 'name', 'email']),
        ];

        return [
            'authUser' => [
                'name' => $user->name,
                'nip' => $user->nip ?? '-',
                'email' => $user->email,
                'division_name' => $user->division?->name ?? '-',
                'position' => $user->getRoleNames()->first() ?? '-',
                'join_date' => $user->created_at?->format('Y-m-d') ?? '-',
                'remaining_annual_leaves' => $remainingAnnualLeaves,
                'is_pegawai' => $user->hasRole('pegawai'),
            ],
            'projects' => $projects,
            'users' => $users,
            'approvers' => $approvers,
        ];
    }
}
