<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class ProjectTerminPayment extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory, SoftDeletes;

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

    protected $appends = ['proof_payment_url'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    protected function getProofPaymentUrlAttribute(): ?string
    {
        return $this->proof_payment ? \Illuminate\Support\Facades\Storage::url($this->proof_payment) : null;
    }
}
