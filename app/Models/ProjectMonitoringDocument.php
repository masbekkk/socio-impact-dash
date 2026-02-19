<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectMonitoringDocument extends Model
{
    protected $fillable = [
        'project_monitoring_id',
        'original_name',
        'path',
        'mime',
        'size',
    ];

    protected $appends = ['url'];

    public function monitoring(): BelongsTo
    {
        return $this->belongsTo(ProjectMonitoring::class, 'project_monitoring_id');
    }

    public function getUrlAttribute(): string
    {
        return \Illuminate\Support\Facades\Storage::url($this->path);
    }
}
