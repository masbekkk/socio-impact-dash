<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\CheckOutRequest;
use App\Http\Requests\StorePresenceRequest;
use App\Models\Presence;
use App\Models\Project;
use App\Services\PresenceService;
use Exception;
use Inertia\Inertia;

final class PresenceController
{
    /**
     * Display a listing of the resource.
     */
    public function index(PresenceService $presenceService): \Inertia\Response
    {
        $user = auth()->user();

        // Define permission for viewing all presences
        // Heads will now go through team-based filtering in the service if they don't have view_all_leaves
        $canViewAll = $user->hasAnyPermission(['view_all_leaves']) || $user->hasRole(['superadmin', 'direktur', 'hr']);

        $presences = $presenceService->getPresenceHistory(
            $canViewAll ? null : $user,
            request()->all(),
            15
        );

        return Inertia::render('Presence/Index', [
            'presences' => $presences,
            'todayPresence' => $presenceService->getTodayPresence($user),
            'filters' => request()->only(['search', 'start_date', 'end_date']),
        ]);
    }

    public function exportExcel(\Illuminate\Http\Request $request): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $user = auth()->user();
        $filters = $request->only(['search', 'start_date', 'end_date']);

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\PresenceExport($user, $filters),
            'presensi_' . now()->format('Ymd_His') . '.xlsx'
        );
    }

    public function checkIn(): void
    {
        // Placeholder
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): \Inertia\Response
    {
        $projects = Project::query()->select('id', 'name')->get();

        return Inertia::render('Presence/Create', [
            'projects' => $projects,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePresenceRequest $request, PresenceService $presenceService): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validated();

        $mappedData = [
            'project_id' => $validated['project_id'],
            'activity' => $validated['activity'],
            'latitude' => $validated['lat'],
            'longitude' => $validated['lng'],
            'photo' => $validated['image'],
        ];

        try {
            $presenceService->checkIn(auth()->user(), $mappedData);

            return to_route('presences.index')->with('success', 'Check-in berhasil.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function checkOut(CheckOutRequest $request, PresenceService $presenceService): \Illuminate\Http\RedirectResponse
    {
        try {
            $presenceService->checkOut(auth()->user(), $request->validated());

            return to_route('presences.index')->with('success', 'Check-out berhasil.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Presence $presence): \Inertia\Response
    {
        $presence->load(['user', 'project']);

        return Inertia::render('Presence/Show', [
            'presence' => $presence,
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
}
