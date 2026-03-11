<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\PresenceStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

final class Presence extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'project_id',
        'activity',
        'date',
        'status',
        'check_in_at',
        'check_out_at',
        'check_in_latitude',
        'check_in_longitude',
        'check_out_latitude',
        'check_out_longitude',
        'photo_path',
        'checkout_photo_path',
        'attachment_path',
        'notes',
    ];

    protected $appends = [
        'image_url',
        'checkout_image_url',
    ];

    public function casts(): array
    {
        return [
            'id' => 'integer',
            'user_id' => 'integer',
            'project_id' => 'integer',
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

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::get(
            fn () => $this->photo_path ? Storage::disk('public')->url($this->photo_path) : null
        );
    }

    protected function checkoutImageUrl(): Attribute
    {
        return Attribute::get(
            fn () => $this->checkout_photo_path ? Storage::disk('public')->url($this->checkout_photo_path) : null
        );
    }
}
