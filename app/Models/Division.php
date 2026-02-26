<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Database\Factories\DivisionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property-read int $id
 * @property-read int $division_code_id
 * @property-read string $name
 * @property-read string|null $description
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 * @property-read \App\Models\DivisionCode $divisionCode
 */
final class Division extends Model
{
    /**
     * @use HasFactory<DivisionFactory>
     */
    use HasFactory;

    protected $fillable = ['division_code_id', 'name', 'description'];

    /**
     * @return BelongsTo<DivisionCode, $this>
     */
    public function divisionCode(): BelongsTo
    {
        return $this->belongsTo(DivisionCode::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
