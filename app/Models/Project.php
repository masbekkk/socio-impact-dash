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
use Illuminate\Support\Str;

/**
 * @property-read int $id
 * @property-read string $code
 * @property-read string $name
 * @property-read string|null $description
 * @property-read int $created_by
 * @property-read int|null $division_id
 * @property-read int|null $account_manager_id
 * @property-read int|null $head_id
 * @property-read int|null $pic_id
 * @property-read ProjectStatus $status
 * @property-read string $project_type
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
        'code', 'name', 'description',
        'division_id', 'account_manager_id', 'head_id', 'pic_id',
        'status', 'project_type',
        'budget_total', 'operational_budget', 'management_budget', 'allowance_budget', 'actual_budget', 'budget_partition_status',
        'start_date', 'end_date', 'created_by', 'uuid', 'lesson_learned',
    ];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function casts(): array
    {
        return [
            'id' => 'integer',
            'division_id' => 'integer',
            'account_manager_id' => 'integer',
            'head_id' => 'integer',
            'pic_id' => 'integer',
            'created_by' => 'integer',
            'status' => ProjectStatus::class,
            'budget_total' => 'decimal:2',
            'operational_budget' => 'decimal:2',
            'management_budget' => 'decimal:2',
            'allowance_budget' => 'decimal:2',
            'actual_budget' => 'decimal:2',
            'start_date' => 'date',
            'end_date' => 'date',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
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

    public function documents(): HasMany
    {
        return $this->hasMany(ProjectDocument::class);
    }

    public function monitorings(): HasMany
    {
        return $this->hasMany(ProjectMonitoring::class);
    }

    public function terminPayments(): HasMany
    {
        return $this->hasMany(ProjectTerminPayment::class);
    }

    public function approvals(): HasMany
    {
        return $this->hasMany(ProjectApproval::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(ProjectEvent::class);
    }

    public function locations(): HasMany
    {
        return $this->hasMany(ProjectLocation::class);
    }

    public function reimbursements(): HasMany
    {
        return $this->hasMany(Reimbursement::class);
    }

    public function budgetDetails(): HasMany
    {
        return $this->hasMany(ProjectBudgetDetail::class);
    }

    protected static function boot(): void
    {
        parent::boot();
        self::creating(function (self $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }
}
