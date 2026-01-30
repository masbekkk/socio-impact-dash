<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ProjectStatus;
use Carbon\CarbonInterface;
use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property-read int $id
 * @property-read string $code
 * @property-read string $name
 * @property-read string $client
 * @property-read string|null $description
 * @property-read int $user_id
 * @property-read int|null $division_id
 * @property-read int|null $account_manager_id
 * @property-read int|null $head_id
 * @property-read int|null $pic_id
 * @property-read ProjectStatus $status
 * @property-read string|null $sow
 * @property-read string|null $budget_total
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class Project extends Model
{
    /**
     * @use HasFactory<ProjectFactory>
     */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code', 'name', 'client', 'description',
        'user_id', 'division_id', 'account_manager_id', 'head_id', 'pic_id',
        'status', 'sow', 'budget_total',
    ];

    public function casts(): array
    {
        return [
            'id' => 'integer',
            'status' => ProjectStatus::class,
            'budget_total' => 'decimal:2',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }

    public function accountManager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'account_manager_id');
    }

    public function head(): BelongsTo
    {
        return $this->belongsTo(User::class, 'head_id');
    }

    public function pic(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pic_id');
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(ProjectMilestone::class);
    }

    public function budgets(): HasMany
    {
        return $this->hasMany(ProjectBudget::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ProjectDocument::class);
    }

    public function issues(): HasMany
    {
        return $this->hasMany(ProjectIssue::class);
    }
}
