<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

final class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'title',
        'message',
        'reference_type',
        'reference_id',
        'priority',
        'scheduled_at',
        'created_by',
    ];

    public function casts(): array
    {
        return [
            'id' => 'integer',
            'reference_id' => 'integer',
            'created_by' => 'integer',
            'scheduled_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the owning reference model (polymorphic).
     */
    public function reference(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the user who created the notification.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all recipients for this notification.
     */
    public function recipients(): HasMany
    {
        return $this->hasMany(NotificationRecipient::class);
    }
}
