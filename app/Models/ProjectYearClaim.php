<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class ProjectYearClaim extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'project_id',
        'year',
        'operational_budget',
        'management_budget',
        'allowance_budget',
    ];

    public function casts(): array
    {
        return [
            'year' => 'integer',
            'operational_budget' => 'decimal:2',
            'management_budget' => 'decimal:2',
            'allowance_budget' => 'decimal:2',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
