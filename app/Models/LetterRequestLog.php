<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class LetterRequestLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'letter_request_id',
        'user_id',
        'action',
        'changes',
        'reason',
        'note',
    ];

    /**
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'letter_request_id' => 'integer',
            'user_id' => 'integer',
            'changes' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function letterRequest(): BelongsTo
    {
        return $this->belongsTo(LetterRequest::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
