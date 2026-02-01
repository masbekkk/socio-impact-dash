<?php

declare(strict_types=1);

use App\Enums\SubmissionType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_submissions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->string('type')->default(SubmissionType::Initial->value)->index();
            $table->year('year')->nullable();
            $table->unsignedTinyInteger('month')->nullable();
            $table->text('kendala')->nullable();
            $table->string('status', 50)->nullable();
            $table->decimal('nominal', 15, 2)->nullable();
            $table->decimal('realisasi_anggaran', 15, 2)->nullable();
            $table->json('financial_projection')->nullable();
            $table->foreignId('submitted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['project_id', 'type', 'year', 'month'], 'project_submissions_project_type_year_month_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_submissions');
    }
};
