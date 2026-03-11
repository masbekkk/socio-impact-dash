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

        $this->applyFilters($query, $user, $filters);

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

    public function applyFilters(\Illuminate\Database\Eloquent\Builder $query, User $user, array $filters): void
    {
        // Apply Role-based filtering
        if ($user->hasAnyRole(['superadmin', 'direktur'])) {
            // Can view all
        } elseif ($user->hasRole('finance')) {
            // Finance with division restriction
            if ($user->division_id) {
                $query->whereHas('project', fn ($q) => $q->where('division_id', $user->division_id));
            }
        } elseif ($user->hasRole('hr')) {
            // HR can see allowances OR their own/team/approvals
            $query->where(function ($q) use ($user) {
                $q->where('type', \App\Enums\ReimbursementType::ALLOWANCE)
                    ->orWhere('user_id', $user->id)
                    ->orWhereHas('user', fn ($uq) => $uq->where('head_id', $user->id))
                    ->orWhereHas('approvals', fn ($aq) => $aq->where('approver_id', $user->id));
            });
        } elseif ($user->hasRole('head')) {
            $query->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                    ->orWhereHas('user', fn ($uq) => $uq->where('head_id', $user->id))
                    ->orWhereHas('approvals', fn ($aq) => $aq->where('approver_id', $user->id));
            });
        } else {
            $query->where('user_id', $user->id);
        }

        if (! empty($filters['status'])) {
            $status = $filters['status'];
            if (is_string($status) && str_contains($status, ',')) {
                $status = explode(',', $status);
            }

            if (is_array($status)) {
                $query->whereIn('status', $status);
            } else {
                // Special handling for 'revision' to include both 'revised' and 'revision'
                if ($status === 'revision' || $status === 'revised') {
                    $query->whereIn('status', ['revision', 'revised']);
                } else {
                    $query->where('status', $status);
                }
            }
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
    }

    public function getReimbursementDetail(int $id): ?Reimbursement
    {
        return Reimbursement::with(['user', 'project.division', 'project.pic', 'project.head', 'documents', 'approvals.approver', 'atrBudgetSelecteds.budgetDetail', 'items.budgetDetail', 'items.children.reimbursement', 'comments.user'])
            ->where('id', $id)
            ->first();
    }
}
