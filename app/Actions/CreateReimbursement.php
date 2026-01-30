<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\ReimbursementStatus;
use App\Models\Reimbursement;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

final readonly class CreateReimbursement
{
    public function handle(array $data): Reimbursement
    {
        return DB::transaction(function () use ($data) {
            return Reimbursement::create([
                'code' => 'RMB-'.mb_strtoupper(uniqid()),
                'user_id' => Auth::id(),
                'project_id' => $data['project_id'] ?? null,
                'type' => $data['type'],
                'status' => ReimbursementStatus::Draft,
                'amount' => $data['amount'],
                'bank_name' => $data['bank_name'] ?? null,
                'bank_account' => $data['bank_account'] ?? null,
                'account_holder' => $data['account_holder'] ?? null,
            ]);
        });
    }
}
