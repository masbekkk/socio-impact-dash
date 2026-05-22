<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

final class ProjectEvent extends Model
{
    use HasFactory, SoftDeletes;

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

    /**
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return BelongsToMany<User, $this>
     */
    public function attendees(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_event_user', 'project_event_id', 'user_id')->withTimestamps();
    }
}
