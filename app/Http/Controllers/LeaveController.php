<?php

declare(strict_types=1);

namespace App\Http\Controllers;

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
        $leaveService = resolve(\App\Services\LeaveService::class);
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
    public function store(): void
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $code): \Inertia\Response
    {
        $user = Auth::user();
        $leave = Leave::query()->where('code', $code)->firstOrFail();

        $leaveService = resolve(\App\Services\LeaveService::class);
        $submitterUsedDays = $leaveService->getAnnualLeaveDaysUsed($leave->user_id, (int) date('Y', strtotime((string) $leave->start_date->toDateString())));
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
    public function edit(): void
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(): void
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(): void
    {
        //
    }

    public function bulkApprove(Request $request): \Illuminate\Http\RedirectResponse
    {
        $ids = $request->input('ids', []);
        if (! empty($ids)) {
            $bulkAction = new \App\Actions\BulkApproveLeaves(new \App\Actions\ApproveLeaveAction());
            $bulkAction->handle($ids);
        }

        return back()->with('success', 'Berhasil menyetujui pengajuan cuti terpilih.');
    }

    public function bulkReject(Request $request): \Illuminate\Http\RedirectResponse
    {
        $ids = $request->input('ids', []);
        $notes = $request->input('notes', []);
        if (! empty($ids)) {
            $bulkAction = new \App\Actions\BulkRejectLeaves(new \App\Actions\RejectLeaveAction());
            $bulkAction->handle($ids, $notes);
        }

        return back()->with('success', 'Berhasil menolak pengajuan cuti terpilih.');
    }

    public function bulkRevision(Request $request): \Illuminate\Http\RedirectResponse
    {
        $ids = $request->input('ids', []);
        $notes = $request->input('notes', []);
        if (! empty($ids)) {
            $bulkAction = new \App\Actions\BulkRevisionLeaves(new \App\Actions\RevisionLeaveAction());
            $bulkAction->handle($ids, $notes);
        }

        return back()->with('success', 'Berhasil meminta revisi pengajuan cuti terpilih.');
    }

    public function approve(string $code): \Illuminate\Http\RedirectResponse
    {
        $leave = Leave::query()->where('code', $code)->firstOrFail();
        $action = new \App\Actions\ApproveLeaveAction();
        $action->handle($leave);

        return back()->with('success', 'Berhasil menyetujui pengajuan cuti.');
    }

    public function reject(string $code): \Illuminate\Http\RedirectResponse
    {
        // Implement reject logic if needed or just redirect back
        return back();
    }

    private function getFormProps(Request $request): array
    {
        $user = $request->user();
        $user->load('division');

        $projects = Project::query()->where('status', 'active')
            ->get(['id', 'code', 'name']);

        $users = User::query()->where('id', '!=', $user->id)
            ->get(['id', 'name', 'email']);

        $leaveService = resolve(\App\Services\LeaveService::class);
        $usedDays = $leaveService->getAnnualLeaveDaysUsed($user->id, (int) date('Y'));
        $remainingAnnualLeaves = max(0, 12 - $usedDays);

        $approvers = [
            'head' => User::query()->role('head')->get(['id', 'name', 'email']),
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
