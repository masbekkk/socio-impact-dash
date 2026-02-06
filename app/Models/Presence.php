<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\PresenceStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Presence extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'date', 
        'status', 
        'check_in_at', 
        'check_out_at', 
        'check_in_latitude', 
        'check_in_longitude',
        'check_out_latitude', 
        'check_out_longitude',
        'photo_path', 
        'attachment_path',
        'notes'
    ];

    public function casts(): array
    {
        return [
            'id' => 'integer',
            'user_id' => 'integer',
            'date' => 'date',
            'status' => PresenceStatus::class,
            'check_in_at' => 'datetime',
            'check_out_at' => 'datetime',
            'check_in_latitude' => 'decimal:8',
            'check_in_longitude' => 'decimal:8',
            'check_out_latitude' => 'decimal:8',
            'check_out_longitude' => 'decimal:8',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
