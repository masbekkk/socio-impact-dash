<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('reimbursements')
            ->where('type', 'eer')
            ->where('eer_type', 'balance')
            ->where('status', 'approved')
            ->whereNull('deleted_at')
            ->whereExists(function ($query): void {
                $query->selectRaw('1')
                    ->from('reimbursement_approvals')
                    ->whereColumn('reimbursement_approvals.reimbursement_id', 'reimbursements.id')
                    ->where('reimbursement_approvals.role', 'finance')
                    ->where('reimbursement_approvals.status', 'approved')
                    ->whereNull('reimbursement_approvals.deleted_at');
            })
            ->whereExists(function ($query): void {
                $query->selectRaw('1')
                    ->from('reimbursement_approvals')
                    ->whereColumn('reimbursement_approvals.reimbursement_id', 'reimbursements.id')
                    ->where('reimbursement_approvals.role', 'direktur')
                    ->where('reimbursement_approvals.status', 'approved')
                    ->whereNull('reimbursement_approvals.deleted_at');
            })
            ->update(['status' => 'closed', 'updated_at' => now()]);
    }

    public function down(): void
    {
        // A closed record cannot be distinguished later from one closed through the normal workflow.
    }
};
