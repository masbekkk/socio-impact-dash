<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $tables = [
        'reimbursement_documents',
        'reimbursement_approvals',
        'reimbursement_items',
        'reimbursement_comments',
        'atr_budget_selecteds',
        'project_documents',
        'project_monitorings',
        'project_termin_payments',
        'project_approvals',
        'project_events',
        'project_locations',
        'project_budget_details',
    ];

    public function up(): void
    {
        foreach ($this->tables as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->softDeletes();
            });
        }
    }

    public function down(): void
    {
        foreach ($this->tables as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->dropSoftDeletes();
            });
        }
    }
};
