<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StorePresenceRequest;
use App\Http\Requests\UpdatePresenceRequest;
use App\Http\Requests\CheckOutRequest;
use App\Models\Presence;
use App\Models\Project;
use App\Services\PresenceService;
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
        $canViewAll = $user->hasRole(['superadmin', 'direktur', 'head', 'hr']);

        $presences = $presenceService->getPresenceHistory(
            $canViewAll ? null : $user, 
            request()->all(), 
            15
        );

        return Inertia::render('Presence/Index', [
            'presences' => $presences,
            'todayPresence' => $presenceService->getTodayPresence($user),
        ]);
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
        $projects = Project::select('id', 'name')->get();
        return Inertia::render('Presence/Create', [
            'projects' => $projects
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
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function checkOut(CheckOutRequest $request, PresenceService $presenceService): \Illuminate\Http\RedirectResponse
    {
        try {
            $presenceService->checkOut(auth()->user(), $request->validated());
            return to_route('presences.index')->with('success', 'Check-out berhasil.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): \Inertia\Response
    {
        // Mock data loading
        $json = file_get_contents(resource_path('js/Pages/Presence/presence_logs.json'));
        $logs = json_decode($json, true);

        // Find the log with the matching ID OR User Name (slug)
        $presence = collect($logs)->first(function (array $log) use ($id): bool {
            $slugName = \Illuminate\Support\Str::slug($log['user']['name']);
            return $log['id'] === $id || $slugName === $id || $log['user']['name'] === $id;
        });

        if (!$presence) {
            abort(404, 'Presence log not found for identifier: ' . $id);
        }

        return Inertia::render('Presence/Show', [
            'presence' => $presence
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Presence $presence): void
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePresenceRequest $request, Presence $presence): void
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Presence $presence): void
    {
        //
    }
}
