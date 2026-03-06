<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ReimbursementDocument extends Model
{
    use HasFactory;

    protected $fillable = ['reimbursement_id', 'type', 'original_name', 'path', 'mime', 'size', 'uploaded_by'];

    public function casts(): array
    {
        return ['id' => 'integer', 'reimbursement_id' => 'integer', 'uploaded_by' => 'integer', 'size' => 'integer'];
    }

    public function reimbursement(): BelongsTo
    {
        return $this->belongsTo(Reimbursement::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
