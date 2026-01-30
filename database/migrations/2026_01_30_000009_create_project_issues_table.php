<?php

declare(strict_types=1);

use App\Enums\IssueSeverity;
use App\Enums\IssueStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_issues', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('severity')->default(IssueSeverity::Medium->value);
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('status')->default(IssueStatus::Open->value);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_issues');
    }
};
