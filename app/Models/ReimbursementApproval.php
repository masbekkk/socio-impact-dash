<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ApprovalRole;
use App\Enums\ApprovalStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class ReimbursementApproval extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['reimbursement_id', 'approver_id', 'role', 'status', 'notes', 'approved_at', 'updated_by'];

    public function casts(): array
    {
        return [
            'id' => 'integer',
            'reimbursement_id' => 'integer',
            'approver_id' => 'integer',
            'updated_by' => 'integer',
            'role' => ApprovalRole::class,
            'status' => ApprovalStatus::class,
            'approved_at' => 'datetime',
        ];
    }

    public function reimbursement(): BelongsTo
    {
        return $this->belongsTo(Reimbursement::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
