<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project_budget_details', function (Blueprint $table) {
            $table->decimal('amount_pelaksanaan', 20, 2)->nullable()->after('amount');
            $table->decimal('amount_proposal', 20, 2)->nullable()->after('amount_pelaksanaan');
        });
    }

    public function down(): void
    {
        Schema::table('project_budget_details', function (Blueprint $table) {
            $table->dropColumn(['amount_pelaksanaan', 'amount_proposal']);
        });
    }
};
