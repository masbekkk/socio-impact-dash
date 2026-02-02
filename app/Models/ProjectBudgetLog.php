<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class ProjectBudgetLog extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'action',
        'project_budget_id',
        'old_planned_amount',
        'new_planned_amount',
        'note',
    ];

    public function casts(): array
    {
        return [
            'id' => 'integer',
            'user_id' => 'integer',
            'project_budget_id' => 'integer',
            'old_planned_amount' => 'decimal:2',
            'new_planned_amount' => 'decimal:2',
        ];
    }

    /**
     * Get the user who made this log
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the budget that owns this log
     */
    public function budget(): BelongsTo
    {
        return $this->belongsTo(ProjectBudget::class, 'project_budget_id');
    }

    /**
     * Calculate the change in planned amount
     */
    public function getChangeDifference(): float
    {
        return (float) ($this->new_planned_amount - $this->old_planned_amount);
    }

    /**
     * Check if this is an increase
     */
    public function isIncrease(): bool
    {
        return $this->new_planned_amount > $this->old_planned_amount;
    }

    /**
     * Check if this is a decrease
     */
    public function isDecrease(): bool
    {
        return $this->new_planned_amount < $this->old_planned_amount;
    }
}
