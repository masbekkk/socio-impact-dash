<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reimbursement_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('reimbursement_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_budget_detail_id')->constrained('project_budget_details')->cascadeOnDelete();
            $table->unsignedBigInteger('parent_item_id')->nullable();
            $table->string('item_name');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->decimal('amount', 15, 2)->default(0);
            $table->string('expense_type')->nullable();
            $table->string('receipt_path')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('parent_item_id')->references('id')->on('reimbursement_items')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reimbursement_items');
    }
};
