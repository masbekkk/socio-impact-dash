<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeaveRequest;
use App\Http\Requests\UpdateLeaveRequest;
use App\Models\Leave;
use Inertia\Inertia;

final class LeaveController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Leave/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Leave/CreateLeave');
    }

    /**
     * Show the form for creating a new travel request.
     */
    public function createTravel()
    {
        return Inertia::render('Leave/CreateTravel');
    }

    public function approvals()
    {
        return Inertia::render('Leave/Index');
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeaveRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        // Mock data for testing - replace with actual database query later
        $mockData = json_decode(file_get_contents(resource_path('js/Pages/Leave/leave-detail.json')), true);

        // Find the leave by slug
        $leave = collect($mockData)->firstWhere('slug', $slug);

        // If not found by slug, try to match by generated slug from user name
        if (!$leave) {
            $leave = collect($mockData)->first(function ($item) use ($slug) {
                $generatedSlug = strtolower(str_replace(' ', '-', $item['user']['name']));
                return $generatedSlug === $slug;
            });
        }

        if (!$leave) {
            abort(404, 'Leave request not found');
        }

        return Inertia::render('Leave/Show', [
            'leave' => $leave,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Leave $leave)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeaveRequest $request, Leave $leave)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Leave $leave)
    {
        //
    }

    /**
     * Approve a leave request.
     */
    public function approve(string $slug)
    {
        // Mock implementation - replace with actual database update later
        // In real implementation:
        // $leave = Leave::where('slug', $slug)->firstOrFail();
        // $leave->status = 'approved';
        // $leave->approver_id = auth()->id();
        // $leave->approved_at = now();
        // $leave->save();

        return redirect()->route('leaves.show', $slug)->with('success', 'Pengajuan berhasil disetujui.');
    }

    /**
     * Reject a leave request.
     */
    public function reject(string $slug)
    {
        // Mock implementation - replace with actual database update later
        // In real implementation:
        // $leave = Leave::where('slug', $slug)->firstOrFail();
        // $leave->status = 'rejected';
        // $leave->approver_id = auth()->id();
        // $leave->rejection_reason = request('reason');
        // $leave->save();

        return redirect()->route('leaves.show', $slug)->with('success', 'Pengajuan berhasil ditolak.');
    }
}
