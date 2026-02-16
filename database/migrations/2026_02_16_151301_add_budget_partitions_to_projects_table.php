<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->decimal('operational_budget', 15, 2)->default(0)->after('budget_total');
            $table->decimal('management_budget', 15, 2)->default(0)->after('operational_budget');
            $table->decimal('allowance_budget', 15, 2)->default(0)->after('management_budget');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['operational_budget', 'management_budget', 'allowance_budget']);
        });
    }
};
