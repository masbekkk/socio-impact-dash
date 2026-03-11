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
        Schema::create('project_monitorings', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('project_id')->constrained('projects', 'id')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->date('report_date');
            $table->string('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_monitorings');
    }
};
