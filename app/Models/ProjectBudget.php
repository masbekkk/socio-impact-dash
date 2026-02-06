<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

final class ProjectBudget extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'project_id',
        'category_id',
        'item_name',
        'quantity',
        'unit_price',
        'planned_amount',
        'actual_amount',
        'status',
    ];

    public function casts(): array
    {
        return [
            'id' => 'integer',
            'project_id' => 'integer',
            'category_id' => 'integer',
            'quantity' => 'integer',
            'unit_price' => 'decimal:2',
            'planned_amount' => 'decimal:2',
            'actual_amount' => 'decimal:2',
        ];
    }

    /**
     * Get the project that owns this budget
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the category that this budget belongs to
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ProjectCategoryBudget::class, 'category_id');
    }

    /**
     * Get all logs for this budget
     */
    public function logs(): HasMany
    {
        return $this->hasMany(ProjectBudgetLog::class);
    }
}
