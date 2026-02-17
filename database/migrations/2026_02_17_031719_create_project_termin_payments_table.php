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
        Schema::create('project_termin_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects', 'id')->cascadeOnDelete()->cascadeOnUpdate();
            $table->decimal('nominal', 15, 2)->nullable();
            $table->date('due_date')->nullable();
            $table->string('notes')->nullable();
            $table->foreignId('verified_by')->constrained('users')->cascadeOnDelete();
            $table->string('proof_payment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_termin_payments');
    }
};
