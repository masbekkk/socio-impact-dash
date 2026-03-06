<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ProjectDocument extends Model
{
    use HasFactory;

    protected $fillable = ['project_id', 'type', 'original_name', 'path', 'mime', 'size', 'uploaded_by', 'upload_status', 'temp_path'];

    protected $appends = ['url'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function getUrlAttribute(): string
    {
        return \Illuminate\Support\Facades\Storage::url($this->path);
    }

    protected function casts(): array
    {
        return ['id' => 'integer', 'project_id' => 'integer', 'uploaded_by' => 'integer', 'size' => 'integer', 'upload_status' => 'string'];
    }
}
