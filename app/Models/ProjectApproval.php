<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class ProjectApproval extends Model
{
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
