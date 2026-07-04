<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_year_claims', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->integer('year');
            $table->decimal('operational_budget', 15, 2)->default(0);
            $table->decimal('management_budget', 15, 2)->default(0);
            $table->decimal('allowance_budget', 15, 2)->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['project_id', 'year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_year_claims');
    }
};
