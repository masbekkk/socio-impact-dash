<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ProjectMonitoringDocument extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $fillable = [
        'project_monitoring_id',
        'title',
        'original_name',
        'path',
        'mime',
        'size',
        'upload_status',
        'temp_path',
    ];

    protected $appends = ['url'];

    public function monitoring(): BelongsTo
    {
        return $this->belongsTo(ProjectMonitoring::class, 'project_monitoring_id');
    }

    protected function getUrlAttribute(): string
    {
        return \Illuminate\Support\Facades\Storage::url($this->path);
    }

    protected function casts(): array
    {
        return [
            'id' => 'integer',
            'project_monitoring_id' => 'integer',
            'size' => 'integer',
            'upload_status' => 'string',
        ];
    }
}
