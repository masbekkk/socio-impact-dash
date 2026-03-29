<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ReimbursementStatus;
use App\Enums\ReimbursementType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Reimbursement extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'user_id', 'project_id', 'atr_id', 'type', 'eer_type', 'status',
        'amount', 'bank_name', 'bank_account', 'account_holder', 'bank_branch',
        'transferred_at', 'transfer_proof_path', 'rejection_reason',
        'usage_plan', 'urgency', 'start_date', 'end_date', 'start_time', 'end_time', 'replacement_pic_id',
    ];

    public function casts(): array
    {
        return [
            'id' => 'integer',
            'user_id' => 'integer',
            'project_id' => 'integer',
            'amount' => 'decimal:2',
            'type' => ReimbursementType::class,
            'status' => ReimbursementStatus::class,
            'transferred_at' => 'datetime',
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

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ReimbursementDocument::class);
    }

    public function approvals(): HasMany
    {
        return $this->hasMany(ReimbursementApproval::class);
    }

    public function atrBudgetSelecteds(): HasMany
    {
        return $this->hasMany(AtrBudgetSelected::class);
    }

    public function atr(): BelongsTo
    {
        return $this->belongsTo(self::class, 'atr_id');
    }

    public function eers(): HasMany
    {
        return $this->hasMany(self::class, 'atr_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(ReimbursementComment::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(ReimbursementItem::class);
    }
}
