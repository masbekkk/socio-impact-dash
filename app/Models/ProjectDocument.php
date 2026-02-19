<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\DocumentType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ProjectDocument extends Model
{
    use HasFactory;

    protected $fillable = ['project_id', 'type', 'original_name', 'path', 'mime', 'size', 'uploaded_by'];

    public function casts(): array
    {
        return ['id' => 'integer', 'project_id' => 'integer', 'uploaded_by' => 'integer', 'type' => DocumentType::class, 'size' => 'integer'];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    protected $appends = ['url'];

    public function getUrlAttribute(): string
    {
        return \Illuminate\Support\Facades\Storage::url($this->path);
    }
}
