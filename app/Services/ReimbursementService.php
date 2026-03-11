<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Reimbursement;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

final class ReimbursementService
{
    public function listReimbursements(User $user, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Reimbursement::with(['user', 'project', 'documents', 'approvals.approver']);

        // Apply Role-based filtering
        if ($user->hasRole('superadmin') || $user->hasRole('finance') || $user->hasRole('direktur')) {
            // Can view all, no extra where needed
        } elseif ($user->hasRole('hr')) {
            // HR can only see allowances
            $query->where('type', \App\Enums\ReimbursementType::ALLOWANCE);
        } elseif ($user->hasRole('head')) {
            // Head can see:
            // 1. Their own reimbursements
            // 2. Their team members' reimbursements
            // 3. Reimbursements where they are an approver
            $query->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                    ->orWhereHas('user', fn ($uq) => $uq->where('head_id', $user->id))
                    ->orWhereHas('approvals', fn ($aq) => $aq->where('approver_id', $user->id));
            });
        } elseif ($user->hasRole('pegawai')) {
            // Pegawai can only see their own ATRs
            $query->where('user_id', $user->id);
        } else {
            // Default fallback for any other roles (only own data)
            $query->where('user_id', $user->id);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (! empty($filters['project_id'])) {
            $query->where('project_id', $filters['project_id']);
        }
        
        if (! empty($filters['division_id']) && $filters['division_id'] !== 'all') {
            $divisionIds = is_array($filters['division_id']) ? $filters['division_id'] : explode(',', (string) $filters['division_id']);
            $query->whereHas('project', fn ($q) => $q->whereIn('division_id', $divisionIds));
        }

        if (! empty($filters['start_date'])) {
            $query->whereDate('created_at', '>=', $filters['start_date']);
        }

        if (! empty($filters['end_date'])) {
            $query->whereDate('created_at', '<=', $filters['end_date']);
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (\Illuminate\Database\Eloquent\Builder $q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhereHas('user', fn (\Illuminate\Database\Eloquent\Builder $u) => $u->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('project', fn (\Illuminate\Database\Eloquent\Builder $p) => $p->where('name', 'like', "%{$search}%"));
            });
        }

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDir = $filters['sort_dir'] ?? 'desc';
        $allowedSorts = ['created_at', 'amount', 'code', 'status'];

        if (in_array($sortBy, $allowedSorts, true)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query->paginate($perPage);
    }

    public function getReimbursementDetail(int $id): ?Reimbursement
    {
        return Reimbursement::with(['user', 'project.division', 'project.pic', 'project.head', 'documents', 'approvals.approver', 'atrBudgetSelecteds.budgetDetail', 'items.budgetDetail', 'items.children.reimbursement', 'comments.user'])
            ->where('id', $id)
            ->first();
    }
}
