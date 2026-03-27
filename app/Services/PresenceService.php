<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\PresenceStatus;
use App\Models\Presence;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

final readonly class PresenceService
{
    public function __construct(
        private FileUploadService $fileUploadService
    ) {}

    public function checkIn(User $user, array $data): Presence
    {
        return DB::transaction(function () use ($user, $data) {
            $today = \Illuminate\Support\Facades\Date::today();

            $existingPresence = $this->getTodayPresence($user);
            throw_if($existingPresence && $existingPresence->check_in_at, Exception::class, 'Anda sudah melakukan check-in hari ini.');

            $presenceData = $this->buildCheckInData($user, $data, $today);

            if (! empty($data['photo']) && $data['photo'] instanceof UploadedFile) {
                $presenceData['photo_path'] = $this->uploadPresencePhoto(
                    $data['photo'],
                    $user->id,
                    'check_in'
                );
            }

            if (! empty($data['attachment']) && $data['attachment'] instanceof UploadedFile) {
                $presenceData['attachment_path'] = $this->uploadAttachment(
                    $data['attachment'],
                    $user->id
                );
            }

            if ($existingPresence instanceof Presence) {
                $existingPresence->update($presenceData);

                return $existingPresence->fresh();
            }

            return Presence::query()->create($presenceData);
        });
    }

    public function checkOut(User $user, array $data): Presence
    {
        return DB::transaction(function () use ($user, $data) {
            $presence = $this->getTodayPresence($user);

            throw_unless($presence, Exception::class, 'Anda belum melakukan check-in hari ini.');

            throw_if($presence->check_out_at, Exception::class, 'Anda sudah melakukan check-out hari ini.');

            $checkOutData = $this->buildCheckOutData($data);

            if (! empty($data['photo']) && $data['photo'] instanceof UploadedFile) {
                $checkOutData['checkout_photo_path'] = $this->uploadPresencePhoto(
                    $data['photo'],
                    $user->id,
                    'check_out'
                );
            }

            $presence->update($checkOutData);

            return $presence->fresh();
        });
    }

    public function submitPermission(User $user, array $data): Presence
    {
        return DB::transaction(function () use ($user, $data) {
            $date = \Illuminate\Support\Facades\Date::parse($data['date']);

            $existingPresence = $this->getPresenceByDate($user, $date);
            throw_if($existingPresence, Exception::class, 'Sudah ada data absensi untuk tanggal tersebut.');

            $presenceData = [
                'user_id' => $user->id,
                'date' => $date,
                'status' => $data['status'],
                'notes' => $data['notes'] ?? null,
            ];

            if (! empty($data['attachment']) && $data['attachment'] instanceof UploadedFile) {
                $presenceData['attachment_path'] = $this->uploadAttachment(
                    $data['attachment'],
                    $user->id
                );
            }

            return Presence::query()->create($presenceData);
        });
    }

    public function getTodayPresence(User $user): ?Presence
    {
        return Presence::query()->where('user_id', $user->id)
            ->whereDate('date', \Illuminate\Support\Facades\Date::today())
            ->first();
    }

    public function getPresenceByDate(User $user, \Carbon\CarbonInterface $date): ?Presence
    {
        return Presence::query()->where('user_id', $user->id)
            ->whereDate('date', $date)
            ->first();
    }

    public function getPresenceHistory(?User $user = null, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Presence::with(['user', 'project']);

        if ($user instanceof User) {
            if ($user->hasAnyRole([\App\Enums\UserRole::Direktur->value, \App\Enums\UserRole::Finance->value, \App\Enums\UserRole::Superadmin->value]) || $user->hasAnyPermission(['view_all_leaves'])) {
                // These roles can view all presence
            } elseif ($user->hasRole(\App\Enums\UserRole::Head->value)) {
                // Head can see:
                // 1. Their own presence
                // 2. Their team members' presence
                $query->where(function ($q) use ($user): void {
                    $q->where('user_id', $user->id)
                        ->orWhereHas('user', fn ($uq) => $uq->where('head_id', $user->id));
                });
            } else {
                $query->where('user_id', $user->id);
            }
        }

        if (! empty($filters['start_date'])) {
            $query->whereDate('date', '>=', $filters['start_date']);
        }

        if (! empty($filters['end_date'])) {
            $query->whereDate('date', '<=', $filters['end_date']);
        }

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters): void {
                $q->whereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$filters['search']}%"))
                    ->orWhere('activity', 'like', "%{$filters['search']}%");
            });
        }

        return $query->orderBy('date', 'desc')->paginate($perPage);
    }

    public function getMonthlySummary(User $user, int $month, int $year): array
    {
        $presences = Presence::query()->where('user_id', $user->id)
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->get();

        return [
            'total_days' => $presences->count(),
            'present' => $presences->whereIn('status', [PresenceStatus::CheckedIn, PresenceStatus::Late])->count(),
            'late' => $presences->where('status', PresenceStatus::Late)->count(),
            'sick' => $presences->where('status', PresenceStatus::Sick)->count(),
            'permission' => $presences->where('status', PresenceStatus::Permission)->count(),
            'annual_leave' => $presences->where('status', PresenceStatus::AnnualLeave)->count(),
            'field_duty' => $presences->where('status', PresenceStatus::FieldDuty)->count(),
            'wfh' => $presences->where('status', PresenceStatus::WorkFromHome)->count(),
            'absent' => $presences->where('status', PresenceStatus::Absent)->count(),
        ];
    }

    private function buildCheckInData(User $user, array $data, \Carbon\CarbonInterface $today): array
    {
        $checkInTime = \Illuminate\Support\Facades\Date::now();
        $status = $this->determineCheckInStatus($checkInTime, $data['status'] ?? null);

        return [
            'user_id' => $user->id,
            'project_id' => $data['project_id'] ?? null,
            'activity' => $data['activity'] ?? null,
            'date' => $today,
            'status' => $status,
            'check_in_at' => $checkInTime,
            'check_in_latitude' => $data['latitude'] ?? null,
            'check_in_longitude' => $data['longitude'] ?? null,
            'notes' => $data['notes'] ?? null,
        ];
    }

    private function buildCheckOutData(array $data): array
    {
        return [
            'check_out_at' => \Illuminate\Support\Facades\Date::now(),
            'check_out_latitude' => $data['latitude'] ?? null,
            'check_out_longitude' => $data['longitude'] ?? null,
            'notes' => $data['notes'] ?? null,
        ];
    }

    private function determineCheckInStatus(\Carbon\CarbonInterface $checkInTime, ?string $requestedStatus): PresenceStatus
    {
        if ($requestedStatus) {
            return PresenceStatus::from($requestedStatus);
        }

        $configTime = config('presence.check_in_time', '09:00');
        $tolerance = config('presence.tolerance_minutes', 15);

        [$hour, $minute] = explode(':', (string) $configTime);

        $lateThreshold = \Illuminate\Support\Facades\Date::today()
            ->setTime((int) $hour, (int) $minute, 0)
            ->addMinutes($tolerance);

        if ($checkInTime->gt($lateThreshold)) {
            return PresenceStatus::Late;
        }

        return PresenceStatus::CheckedIn;
    }

    private function uploadPresencePhoto(UploadedFile $file, int $userId, string $type): string
    {
        $storagePath = "presences/{$userId}/{$type}";
        $metadata = $this->fileUploadService->uploadFile($file, $storagePath);

        return $metadata['path'];
    }

    private function uploadAttachment(UploadedFile $file, int $userId): string
    {
        $storagePath = "presences/{$userId}/attachments";
        $metadata = $this->fileUploadService->uploadFile($file, $storagePath);

        return $metadata['path'];
    }
}
