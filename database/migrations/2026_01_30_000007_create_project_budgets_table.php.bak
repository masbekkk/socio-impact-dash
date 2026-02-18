<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_budgets', function (Blueprint $table): void {
            $table->id();
            $table->string('item_name');
            $table->integer('quantity');
            $table->decimal('unit_price', 15, 2);
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('project_category_budgets')->cascadeOnDelete();
            $table->decimal('planned_amount', 15, 2);
            $table->decimal('actual_amount', 15, 2)->default(0);
            $table->string('status')->default('pending');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_budgets');
    }
};
