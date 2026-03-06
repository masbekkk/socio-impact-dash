<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ExpenseType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class ReimbursementItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'reimbursement_id',
        'project_budget_detail_id',
        'parent_item_id',
        'item_name',
        'quantity',
        'unit_price',
        'amount',
        'expense_type',
        'receipt_path',
        'notes',
    ];

    public function reimbursement(): BelongsTo
    {
        return $this->belongsTo(Reimbursement::class);
    }

    public function budgetDetail(): BelongsTo
    {
        return $this->belongsTo(ProjectBudgetDetail::class, 'project_budget_detail_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_item_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_item_id');
    }

    protected function casts(): array
    {
        return [
            'reimbursement_id' => 'integer',
            'project_budget_detail_id' => 'integer',
            'parent_item_id' => 'integer',
            'quantity' => 'integer',
            'unit_price' => 'float',
            'amount' => 'float',
            'expense_type' => ExpenseType::class,
        ];
    }
}
