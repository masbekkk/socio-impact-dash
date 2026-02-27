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
        Schema::create('atr_budget_selecteds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reimbursement_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_budget_detail_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('atr_budget_selecteds');
    }
};
