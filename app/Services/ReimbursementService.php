<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Reimbursement;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class ReimbursementService
{
    public function listReimbursements(User $user, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {   


        $query = Reimbursement::with(['user', 'project', 'documents']);

        if (!$user->hasAnyPermission(['approve_reimbursements', 'reject_reimbursements'])) {
            $query->where('user_id', $user->id);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['project_id'])) {
            $query->where('project_id', $filters['project_id']);
        }

        if (!empty($filters['start_date'])) {
            $query->whereDate('created_at', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->whereDate('created_at', '<=', $filters['end_date']);
        }

        if (!empty($filters['search'])) {
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

    public function getReimbursementDetail(string $code): ?Reimbursement
    {
        return Reimbursement::with(['user', 'project.division', 'project.pic', 'project.head', 'documents', 'approvals.approver', 'atrBudgetSelecteds.budgetDetail'])
            ->where('code', $code)
            ->first();
    }
}
