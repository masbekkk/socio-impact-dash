<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Reimbursement;
use App\Models\User;
use Closure;
use Illuminate\Pagination\LengthAwarePaginator;

final class ReimbursementService
{
    public function listReimbursements(User $user, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $isAtrTab = ($filters['type'] ?? '') === 'atr';
        $isEerTab = ($filters['type'] ?? '') === 'eer';
        $eerFilterClosure = ($isAtrTab || $isEerTab) ? $this->buildEerFilterClosure($filters) : null;

        $eagerLoads = ['user', 'project', 'documents', 'approvals.approver', 'atrBudgetSelecteds'];

        if ($eerFilterClosure !== null) {
            $eagerLoads['eers'] = $eerFilterClosure;
            $eagerLoads[] = 'eers.user';
            $eagerLoads[] = 'eers.project';
            $eagerLoads[] = 'eers.approvals.approver';
        } else {
            $eagerLoads[] = 'eers.user';
            $eagerLoads[] = 'eers.project';
            $eagerLoads[] = 'eers.approvals.approver';
        }

        $query = Reimbursement::with($eagerLoads);

        $this->applyFilters($query, $user, $filters);

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDir = $filters['sort_dir'] ?? 'desc';
        $allowedSorts = ['created_at', 'amount', 'code', 'status'];

        if (in_array($sortBy, $allowedSorts, true)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        } else {
            $query->latest();
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
            $query->where(function ($q) use ($user): void {
                $q->where('type', \App\Enums\ReimbursementType::ALLOWANCE)
                    ->orWhere('user_id', $user->id)
                    ->orWhereHas('user', fn ($uq) => $uq->where('head_id', $user->id))
                    ->orWhereHas('approvals', fn ($aq) => $aq->where('approver_id', $user->id));
            });
        } elseif ($user->hasRole('head')) {
            $query->where(function ($q) use ($user): void {
                $q->where('user_id', $user->id)
                    ->orWhereHas('user', fn ($uq) => $uq->where('head_id', $user->id))
                    ->orWhereHas('approvals', fn ($aq) => $aq->where('approver_id', $user->id));
            });
        } else {
            $query->where('user_id', $user->id);
        }

        $isAtrTab = ($filters['type'] ?? '') === 'atr';
        $isEerTab = ($filters['type'] ?? '') === 'eer';

        // EER Tab special query filtering
        if ($isEerTab) {
            $query->where('type', \App\Enums\ReimbursementType::ATR);
            $query->whereHas('eers', function (\Illuminate\Database\Eloquent\Builder $eerQ) use ($filters): void {
                $eerQ->whereNull('deleted_at');

                if (! empty($filters['status'])) {
                    $status = $filters['status'];
                    if (is_string($status) && str_contains($status, ',')) {
                        $status = explode(',', $status);
                    }

                    if (is_array($status)) {
                        $eerQ->whereIn('status', $status);
                    } elseif ($status === 'revision' || $status === 'revised') {
                        $eerQ->whereIn('status', ['revision', 'revised']);
                    } else {
                        $eerQ->where('status', $status);
                    }
                }

                if (! empty($filters['start_date'])) {
                    $eerQ->whereDate('created_at', '>=', $filters['start_date']);
                }

                if (! empty($filters['end_date'])) {
                    $eerQ->whereDate('created_at', '<=', $filters['end_date']);
                }

                if (! empty($filters['search'])) {
                    $search = $filters['search'];
                    $eerQ->where(function (\Illuminate\Database\Eloquent\Builder $sq) use ($search): void {
                        $sq->where('code', 'like', "%{$search}%")
                            ->orWhere('usage_plan', 'like', "%{$search}%")
                            ->orWhere('amount', 'like', "%{$search}%")
                            ->orWhereHas('user', fn (\Illuminate\Database\Eloquent\Builder $u) => $u->where('name', 'like', "%{$search}%"));
                    });
                }
            });
        }

        // Status filter for ATR/Allowance/All tabs
        if (! $isEerTab && ! empty($filters['status'])) {
            $status = $filters['status'];
            if (is_string($status) && str_contains($status, ',')) {
                $status = explode(',', $status);
            }

            $statusCondition = function (\Illuminate\Database\Eloquent\Builder $q) use ($status): void {
                if (is_array($status)) {
                    $q->whereIn('status', $status);
                } elseif ($status === 'revision' || $status === 'revised') {
                    $q->whereIn('status', ['revision', 'revised']);
                } else {
                    $q->where('status', $status);
                }
            };

            if ($isAtrTab) {
                $query->where(function (\Illuminate\Database\Eloquent\Builder $q) use ($statusCondition, $status): void {
                    $statusCondition($q);
                    $q->orWhereHas('eers', function (\Illuminate\Database\Eloquent\Builder $eerQ) use ($status): void {
                        if (is_array($status)) {
                            $eerQ->whereIn('status', $status);
                        } elseif ($status === 'revision' || $status === 'revised') {
                            $eerQ->whereIn('status', ['revision', 'revised']);
                        } else {
                            $eerQ->where('status', $status);
                        }
                    });
                });
            } else {
                $statusCondition($query);
            }
        }

        // Type filter
        if ($isEerTab) {
            // Already handled above
        } elseif (! empty($filters['type'])) {
            $query->where('type', $filters['type']);
        } else {
            $query->where('type', '!=', \App\Enums\ReimbursementType::EER);
        }

        if (! empty($filters['project_id'])) {
            $query->where('project_id', $filters['project_id']);
        }

        if (! empty($filters['division_id']) && $filters['division_id'] !== 'all') {
            $divisionIds = is_array($filters['division_id']) ? $filters['division_id'] : explode(',', (string) $filters['division_id']);
            $query->whereHas('project', fn ($q) => $q->whereIn('division_id', $divisionIds));
        }

        // Date range filters for ATR/Allowance/All tabs
        if (! $isEerTab && ! empty($filters['start_date'])) {
            if ($isAtrTab) {
                $query->where(function (\Illuminate\Database\Eloquent\Builder $q) use ($filters): void {
                    $q->whereDate('created_at', '>=', $filters['start_date'])
                        ->orWhereHas('eers', fn (\Illuminate\Database\Eloquent\Builder $eerQ) => $eerQ->whereDate('created_at', '>=', $filters['start_date']));
                });
            } else {
                $query->whereDate('created_at', '>=', $filters['start_date']);
            }
        }

        if (! $isEerTab && ! empty($filters['end_date'])) {
            if ($isAtrTab) {
                $query->where(function (\Illuminate\Database\Eloquent\Builder $q) use ($filters): void {
                    $q->whereDate('created_at', '<=', $filters['end_date'])
                        ->orWhereHas('eers', fn (\Illuminate\Database\Eloquent\Builder $eerQ) => $eerQ->whereDate('created_at', '<=', $filters['end_date']));
                });
            } else {
                $query->whereDate('created_at', '<=', $filters['end_date']);
            }
        }

        // Search filter for ATR/Allowance/All tabs
        if (! $isEerTab && ! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (\Illuminate\Database\Eloquent\Builder $q) use ($search, $isAtrTab): void {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('usage_plan', 'like', "%{$search}%")
                    ->orWhere('amount', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhereHas('user', fn (\Illuminate\Database\Eloquent\Builder $u) => $u->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('project', function (\Illuminate\Database\Eloquent\Builder $p) use ($search) {
                        $p->where('name', 'like', "%{$search}%")
                            ->orWhere('code', 'like', "%{$search}%")
                            ->orWhere('initial_project', 'like', "%{$search}%");
                    });

                if ($isAtrTab) {
                    $q->orWhereHas('eers', function (\Illuminate\Database\Eloquent\Builder $eerQ) use ($search): void {
                        $eerQ->where('code', 'like', "%{$search}%")
                            ->orWhere('usage_plan', 'like', "%{$search}%")
                            ->orWhere('amount', 'like', "%{$search}%")
                            ->orWhereHas('user', fn (\Illuminate\Database\Eloquent\Builder $u) => $u->where('name', 'like', "%{$search}%"));
                    });
                }
            });
        }
    }

    public function getReimbursementDetail(int|string $identifier): ?Reimbursement
    {
        $query = Reimbursement::with(['user', 'project.division', 'project.pic', 'project.head', 'documents', 'approvals.approver', 'atrBudgetSelecteds.budgetDetail', 'items.budgetDetail', 'items.children.reimbursement', 'comments.user']);

        if (is_numeric($identifier)) {
            $identifier = (int) $identifier;

            return $query->where('id', $identifier)->first();
        }

        return $query->where('code', $identifier)->first();
    }

    /**
     * Build a closure that constrains the eager-loaded eers relationship
     * to only include EERs matching the active filters.
     */
    private function buildEerFilterClosure(array $filters): Closure
    {
        return function (\Illuminate\Database\Eloquent\Relations\HasMany $q) use ($filters): void {
            $q->whereNull('deleted_at');

            if (! empty($filters['status'])) {
                $status = $filters['status'];
                if (is_string($status) && str_contains($status, ',')) {
                    $status = explode(',', $status);
                }

                if (is_array($status)) {
                    $q->whereIn('status', $status);
                } elseif ($status === 'revision' || $status === 'revised') {
                    $q->whereIn('status', ['revision', 'revised']);
                } else {
                    $q->where('status', $status);
                }
            }

            if (! empty($filters['start_date'])) {
                $q->whereDate('created_at', '>=', $filters['start_date']);
            }

            if (! empty($filters['end_date'])) {
                $q->whereDate('created_at', '<=', $filters['end_date']);
            }

            if (! empty($filters['search'])) {
                $search = $filters['search'];
                $q->where(function (\Illuminate\Database\Eloquent\Builder $sq) use ($search): void {
                    $sq->where('code', 'like', "%{$search}%")
                        ->orWhere('usage_plan', 'like', "%{$search}%")
                        ->orWhere('amount', 'like', "%{$search}%")
                        ->orWhereHas('user', fn (\Illuminate\Database\Eloquent\Builder $u) => $u->where('name', 'like', "%{$search}%"));
                });
            }
        };
    }
}
