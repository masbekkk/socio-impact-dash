<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Leave;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

final class LeaveService
{
    public function listLeaves(User $user, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Leave::with(['user', 'project', 'replacementPic', 'approvals.approver']);

        if (!$user->hasAnyPermission(['approve_leaves', 'reject_leaves'])) {
            $query->where('user_id', $user->id);
        }

        if (!empty($filters['type'])) {
            if ($filters['type'] === 'leave') {
                $query->where('type', '!=', 'travel');
            } else {
                $query->where('type', $filters['type']);
            }
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['start_date'])) {
            $query->whereDate('start_date', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->whereDate('end_date', '<=', $filters['end_date']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search): void {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('reason', 'like', "%{$search}%")
                    ->orWhere('destination', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%"));
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
}
