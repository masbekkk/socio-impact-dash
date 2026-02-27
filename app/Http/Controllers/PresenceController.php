<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StorePresenceRequest;
use App\Http\Requests\UpdatePresenceRequest;
use App\Models\Presence;
use Inertia\Inertia;

final class PresenceController
{
    /**
     * Display a listing of the resource.
     */
    public function index(): \Inertia\Response
    {
        return Inertia::render('Presence/Index');
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
        return Inertia::render('Presence/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePresenceRequest $request): \Illuminate\Http\RedirectResponse
    {
        // Validation is handled by StorePresenceRequest
        // Logic to store presence

        return to_route('presences.index')->with('success', 'Presensi berhasil dikirim.');
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
