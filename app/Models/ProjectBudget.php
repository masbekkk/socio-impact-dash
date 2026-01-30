<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ProjectBudget extends Model
{
    use HasFactory;

    protected $fillable = ['project_id', 'category', 'planned_amount', 'actual_amount'];

    public function casts(): array
    {
        return ['id' => 'integer', 'project_id' => 'integer', 'planned_amount' => 'decimal:2', 'actual_amount' => 'decimal:2'];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
