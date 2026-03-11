<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class ProjectBudgetDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'item_name',
        'quantity',
        'item_price',
        'amount',
        'amount_pelaksanaan',
        'amount_proposal',
        'notes',
        'created_by',
    ];

    /**
     * Get the project that owns the budget detail.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the user who created the budget detail.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the reimbursement items linked to this budget detail.
     */
    public function reimbursementItems(): HasMany
    {
        return $this->hasMany(ReimbursementItem::class, 'project_budget_detail_id');
    }

    /**
     * Get the total used amount from approved/in-progress ATR items.
     */
    protected function getUsedAmountAttribute(): float
    {
        return (float) $this->reimbursementItems()
            ->whereHas('reimbursement', function ($q): void {
                $q->where('type', 'atr')
                    ->whereNotIn('status', ['rejected', 'draft']);
            })
            ->whereNull('parent_item_id')
            ->sum('amount');
    }

    /**
     * Get remaining available amount for new ATR claims.
     */
    protected function getRemainingAmountAttribute(): float
    {
        $base = $this->amount_pelaksanaan > 0 ? $this->amount_pelaksanaan : $this->amount;

        return max(0, $base - $this->used_amount);
    }

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'item_price' => 'float',
            'amount' => 'float',
            'amount_pelaksanaan' => 'float',
            'amount_proposal' => 'float',
        ];
    }
}
