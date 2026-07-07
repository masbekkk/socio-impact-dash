<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project_year_claims', function (Blueprint $table): void {
            $table->decimal('amount', 15, 2)->default(0)->after('year');
        });

        DB::statement('UPDATE project_year_claims SET amount = operational_budget + management_budget + allowance_budget');

        Schema::table('project_year_claims', function (Blueprint $table): void {
            $table->dropColumn(['operational_budget', 'management_budget', 'allowance_budget']);
        });
    }

    public function down(): void
    {
        Schema::table('project_year_claims', function (Blueprint $table): void {
            $table->decimal('operational_budget', 15, 2)->default(0)->after('year');
            $table->decimal('management_budget', 15, 2)->default(0)->after('operational_budget');
            $table->decimal('allowance_budget', 15, 2)->default(0)->after('management_budget');
        });

        DB::statement('UPDATE project_year_claims SET operational_budget = amount, management_budget = 0, allowance_budget = 0');

        Schema::table('project_year_claims', function (Blueprint $table): void {
            $table->dropColumn('amount');
        });
    }
};
