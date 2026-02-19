<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ProjectTerminPayment extends Model
{
    protected $fillable = [
        'project_id',
        'nominal',
        'due_date',
        'notes',
        'verified_by',
        'proof_payment',
    ];

    protected $casts = [
        'nominal' => 'decimal:2',
        'due_date' => 'date',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
