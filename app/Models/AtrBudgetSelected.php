<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class AtrBudgetSelected extends Model
{
    use HasFactory;

    protected $fillable = [
        'reimbursement_id',
        'project_budget_detail_id',
        'amount',
        'notes',
    ];

    public function reimbursement(): BelongsTo
    {
        return $this->belongsTo(Reimbursement::class);
    }

    public function budgetDetail(): BelongsTo
    {
        return $this->belongsTo(ProjectBudgetDetail::class, 'project_budget_detail_id');
    }

    protected function casts(): array
    {
        return [
            'amount' => 'float',
            'reimbursement_id' => 'integer',
            'project_budget_detail_id' => 'integer',
        ];
    }
}
