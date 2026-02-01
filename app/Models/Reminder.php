<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ReminderType;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read int $id
 * @property-read int|null $project_id
 * @property-read ReminderType $type
 * @property-read string $title
 * @property-read string|null $message
 * @property-read CarbonInterface|null $due_at
 * @property-read CarbonInterface|null $sent_at
 * @property-read int|null $created_by
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class Reminder extends Model
{
    protected $fillable = [
        'project_id', 'type', 'title', 'message',
        'due_at', 'sent_at', 'created_by',
    ];

    public function casts(): array
    {
        return [
            'id' => 'integer',
            'project_id' => 'integer',
            'type' => ReminderType::class,
            'due_at' => 'datetime',
            'sent_at' => 'datetime',
            'created_by' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
