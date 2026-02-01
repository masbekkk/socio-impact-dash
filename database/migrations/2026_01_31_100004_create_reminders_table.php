<?php

declare(strict_types=1);

use App\Enums\ReminderType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reminders', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('project_id')->nullable()->constrained('projects')->cascadeOnDelete();
            $table->string('type')->default(ReminderType::Other->value)->index();
            $table->string('title');
            $table->text('message')->nullable();
            $table->timestamp('due_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('due_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reminders');
    }
};
