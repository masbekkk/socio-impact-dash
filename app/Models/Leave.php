<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\LeaveStatus;
use App\Enums\LeaveType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Leave extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'user_id', 'replacement_pic_id', 'lokasi',
        'type', 'status', 'start_date', 'end_date', 'reason', 'attachment_path',
    ];

    public function casts(): array
    {
        return [
            'id' => 'integer',
            'user_id' => 'integer',
            'replacement_pic_id' => 'integer',
            'type' => LeaveType::class,
            'status' => LeaveStatus::class,
            'start_date' => 'date',
            'end_date' => 'date',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function replacementPic(): BelongsTo
    {
        return $this->belongsTo(User::class, 'replacement_pic_id');
    }

    public function approvals(): HasMany
    {
        return $this->hasMany(LeaveApproval::class);
    }
}
