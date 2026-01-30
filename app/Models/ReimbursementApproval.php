<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ApprovalRole;
use App\Enums\ApprovalStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ReimbursementApproval extends Model
{
    use HasFactory;

    protected $fillable = ['reimbursement_id', 'approver_id', 'role', 'status', 'notes', 'approved_at'];

    public function casts(): array
    {
        return [
            'id' => 'integer',
            'reimbursement_id' => 'integer',
            'approver_id' => 'integer',
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
}
