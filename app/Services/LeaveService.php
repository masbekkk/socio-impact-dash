<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Leave;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class LeaveService
{
    public function listLeaves(User $user, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Leave::with(['user', 'project', 'replacementPic', 'approvals.approver']);

        if (! $user->hasAnyPermission(['view_all_leaves'])) {
            if ($user->hasRole(\App\Enums\UserRole::Head->value)) {
                $teamMemberIds = $user->teamMembers()->pluck('id')->push($user->id)->toArray();
                $query->whereIn('user_id', $teamMemberIds);
            } else {
                $query->where('user_id', $user->id);
            }
        }

        if (! empty($filters['type'])) {
            if ($filters['type'] === 'leave') {
                $query->where('type', '!=', 'travel');
            } else {
                $query->where('type', $filters['type']);
            }
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['start_date'])) {
            $query->whereDate('start_date', '>=', $filters['start_date']);
        }

        if (! empty($filters['end_date'])) {
            $query->whereDate('end_date', '<=', $filters['end_date']);
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (\Illuminate\Database\Eloquent\Builder $q) use ($search): void {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('reason', 'like', "%{$search}%")
                    ->orWhere('destination', 'like', "%{$search}%")
                    ->orWhereHas('user', fn (\Illuminate\Database\Eloquent\Builder $u) => $u->where('name', 'like', "%{$search}%"));
            });
        }

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDir = $filters['sort_dir'] ?? 'desc';
        $allowedSorts = ['created_at', 'start_date', 'end_date', 'code', 'type', 'status'];

        if (in_array($sortBy, $allowedSorts, true)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query->paginate($perPage);
    }

    public function findByCode(string $code): Leave
    {
        return Leave::with(['user', 'project', 'replacementPic', 'approvals.approver'])
            ->where('code', $code)
            ->firstOrFail();
    }

    public function calculateTotalDays(string $startDate, string $endDate): int
    {
        $start = \Illuminate\Support\Carbon::parse($startDate)->startOfDay();
        $end = \Illuminate\Support\Carbon::parse($endDate)->startOfDay();

        if ($start->gt($end)) {
            return 0;
        }

        $days = 0;
        while ($start->lte($end)) {
            if ($start->isWeekday()) {
                $days++;
            }
            $start->addDay();
        }

        return $days;
    }

    public function getAnnualLeaveDaysUsed(int $userId, int $year): int
    {
        $leaves = Leave::where('user_id', $userId)
            ->where('type', \App\Enums\LeaveType::Annual)
            ->where('status', '!=', \App\Enums\LeaveStatus::Rejected)
            ->whereYear('start_date', $year)
            ->get(['start_date', 'end_date']);

        $totalDays = 0;
        foreach ($leaves as $leave) {
            $totalDays += $this->calculateTotalDays(
                $leave->start_date->toDateString(),
                $leave->end_date->toDateString()
            );
        }

        return $totalDays;
    }
}
