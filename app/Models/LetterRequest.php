<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

final class LetterRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'project_id',
        'requester_id',
        'letter_date',
        'recipient',
        'subject',
        'pic_id',
        'division_id',
        'letter_code_id',
        'letter_division_id',
        'keterangan',
        'letter_number',
        'status',
        'approval_status',
    ];

    protected $casts = [
        'letter_date' => 'date',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function pic(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pic_id');
    }

    public function letterCode(): BelongsTo
    {
        return $this->belongsTo(LetterCode::class);
    }

    public function letterDivision(): BelongsTo
    {
        return $this->belongsTo(LetterDivision::class);
    }

    public function division(): BelongsTo
    {
        return $this->belongsTo(DivisionCode::class, 'division_id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(LetterRequestLog::class)->orderBy('created_at', 'desc');
    }
}
