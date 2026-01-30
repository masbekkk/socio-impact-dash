<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\LeaveStatus;
use App\Models\Leave;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

final readonly class CreateLeave
{
    public function handle(array $data): Leave
    {
        return DB::transaction(function () use ($data) {
            return Leave::create([
                'code' => 'LV-'.mb_strtoupper(uniqid()),
                'user_id' => Auth::id(),
                'type' => $data['type'],
                'status' => LeaveStatus::Draft,
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'reason' => $data['reason'] ?? null,
                'attachment_path' => $data['attachment_path'] ?? null,
            ]);
        });
    }
}
