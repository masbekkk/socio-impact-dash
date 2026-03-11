<?php

declare(strict_types=1);

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
        Schema::table('project_budget_details', function (Blueprint $table): void {
            $table->string('item_name')->after('project_id');
            $table->integer('quantity')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_budget_details', function (Blueprint $table): void {
            $table->dropColumn('item_name');
            $table->integer('quantity')->default(1)->nullable(false)->change();
        });
    }
};
