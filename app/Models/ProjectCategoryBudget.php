<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

final class ProjectCategoryBudget extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'total_amount',
        'status',
    ];

    public function casts(): array
    {
        return [
            'id' => 'integer',
            'total_amount' => 'decimal:2',
        ];
    }

    /**
     * Get all budget items in this category
     */
    public function budgets(): HasMany
    {
        return $this->hasMany(ProjectBudget::class, 'category_id');
    }

    /**
     * Calculate total planned amount from all budgets in this category
     */
    public function calculateTotalPlanned(): float
    {
        return (float) $this->budgets()->sum('planned_amount');
    }

    /**
     * Calculate total actual amount from all budgets in this category
     */
    public function calculateTotalActual(): float
    {
        return (float) $this->budgets()->sum('actual_amount');
    }
}
