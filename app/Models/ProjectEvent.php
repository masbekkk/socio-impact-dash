<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ProjectEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'created_by',
        'name',
        'start_date',
        'end_date',
        'event_date', // Keeping for backward compatibility temporarily if needed
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'event_date' => 'date', // Keeping for backward compatibility
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
