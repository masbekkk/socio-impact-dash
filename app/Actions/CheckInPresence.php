<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\PresenceStatus;
use App\Models\Presence;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

final readonly class CheckInPresence
{
    public function handle(array $data): Presence
    {
        $checkInTime = Carbon::parse($data['check_in_at'] ?? now());
        $status = $checkInTime->hour >= 9 ? PresenceStatus::Late : PresenceStatus::CheckedIn;

        return Presence::create([
            'user_id' => Auth::id(),
            'date' => $checkInTime->toDateString(),
            'status' => $status,
            'check_in_at' => $checkInTime,
            'latitude' => $data['latitude'],
            'longitude' => $data['longitude'],
            'photo_path' => $data['photo_path'],
            'notes' => $data['notes'] ?? null,
        ]);
    }
}
