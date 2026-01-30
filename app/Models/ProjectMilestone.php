<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\MilestoneStatus;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read int $id
 * @property-read int $project_id
 * @property-read string $title
 * @property-read string|null $description
 * @property-read CarbonInterface $target_date
 * @property-read CarbonInterface|null $actual_date
 * @property-read MilestoneStatus $status
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class ProjectMilestone extends Model
{
    use HasFactory;

    protected $fillable = ['project_id', 'title', 'description', 'target_date', 'actual_date', 'status'];

    public function casts(): array
    {
        return ['id' => 'integer', 'project_id' => 'integer', 'target_date' => 'date', 'actual_date' => 'date', 'status' => MilestoneStatus::class];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
