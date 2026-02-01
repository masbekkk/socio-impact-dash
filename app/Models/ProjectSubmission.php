<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\SubmissionType;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read int $id
 * @property-read int $project_id
 * @property-read SubmissionType $type
 * @property-read int|null $year
 * @property-read int|null $month
 * @property-read string|null $kendala
 * @property-read string|null $status
 * @property-read string|null $nominal
 * @property-read string|null $realisasi_anggaran
 * @property-read array|null $financial_projection
 * @property-read int|null $submitted_by
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class ProjectSubmission extends Model
{
    protected $fillable = [
        'project_id', 'type', 'year', 'month',
        'kendala', 'status', 'nominal', 'realisasi_anggaran', 'financial_projection',
        'submitted_by',
    ];

    public function casts(): array
    {
        return [
            'id' => 'integer',
            'project_id' => 'integer',
            'type' => SubmissionType::class,
            'year' => 'integer',
            'month' => 'integer',
            'nominal' => 'decimal:2',
            'realisasi_anggaran' => 'decimal:2',
            'financial_projection' => 'array',
            'submitted_by' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }
}
