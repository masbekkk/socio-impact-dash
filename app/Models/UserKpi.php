<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read int $id
 * @property-read int $user_id
 * @property-read float $nominal
 * @property-read int $year
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class UserKpi extends Model
{
    use HasFactory;

    protected $table = 'user_kpis';

    protected $fillable = [
        'user_id',
        'nominal',
        'year',
    ];

    public function casts(): array
    {
        return [
            'id' => 'integer',
            'user_id' => 'integer',
            'nominal' => 'float',
            'year' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
