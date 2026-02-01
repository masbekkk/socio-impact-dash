<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ProjectHealth;
use App\Enums\ProjectStatus;
use App\Enums\ProjectType;
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
 * @property-read int|null $pc_id
 * @property-read int|null $implementation_pic_id
 * @property-read ProjectStatus $status
 * @property-read string|null $sow
 * @property-read string $project_type
 * @property-read string|null $budget_total
 * @property-read \Carbon\CarbonInterface|null $spk_start_date
 * @property-read \Carbon\CarbonInterface|null $spk_end_date
 * @property-read string|null $nominal_planned
 * @property-read array|null $financial_projection
 * @property-read ProjectHealth|null $health
 * @property-read string|null $region
 * @property-read string|null $notes
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
        'pc_id', 'implementation_pic_id',
        'status', 'project_type', 'sow', 'budget_total',
        'spk_start_date', 'spk_end_date', 'nominal_planned', 'financial_projection',
        'health', 'region', 'notes',
    ];

    public function casts(): array
    {
        return [
            'id' => 'integer',
            'status' => ProjectStatus::class,
            'project_type' => ProjectType::class,
            'health' => ProjectHealth::class,
            'budget_total' => 'decimal:2',
            'nominal_planned' => 'decimal:2',
            'spk_start_date' => 'date',
            'spk_end_date' => 'date',
            'financial_projection' => 'array',
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

    public function pc(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pc_id');
    }

    public function implementationPic(): BelongsTo
    {
        return $this->belongsTo(User::class, 'implementation_pic_id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(ProjectSubmission::class, 'project_id');
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(Reminder::class, 'project_id');
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

    public function locations(): HasMany
    {
        return $this->hasMany(ProjectLocation::class);
    }
}
