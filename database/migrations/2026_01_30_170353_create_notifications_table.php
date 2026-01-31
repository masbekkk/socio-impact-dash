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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            // core notification
            $table->string('type', 100); // project_reminder, approval_request, early_warning
            $table->string('title');
            $table->text('message');

            // polymorphic reference
            $table->string('reference_type', 100)->nullable(); // project, reimbursement, leave
            $table->unsignedBigInteger('reference_id')->nullable();

            // priority & scheduling
            $table->string('priority', 50)->default('normal'); // low, normal, high, urgent
            $table->timestamp('scheduled_at')->nullable();

            // audit
            $table->foreignId('created_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            $table->timestamps();

            // indexes
            $table->index(['reference_type', 'reference_id']);
            $table->index('type');
            $table->index('priority');
            $table->index('scheduled_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
