<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class ProjectApproval extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory, SoftDeletes;

    protected $fillable = [
        'project_id',
        'approved_by',
        'approval_type',
        'approval_status',
        'notes',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
