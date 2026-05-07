<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class ProjectLocation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'project_id',
        'latitude',
        'longitude',
        'detail_address',
    ];

    public function casts(): array
    {
        return [
            'id' => 'integer',
            'project_id' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
