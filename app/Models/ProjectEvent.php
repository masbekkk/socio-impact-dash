<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class ProjectEvent extends Model
{
    protected $fillable = [
        'project_id',
        'created_by',
        'event_date',
        'notes',
    ];

    protected $casts = [
        'event_date' => 'date',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
