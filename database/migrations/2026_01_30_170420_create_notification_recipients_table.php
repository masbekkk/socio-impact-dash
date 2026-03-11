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
        Schema::create('notification_recipients', function (Blueprint $table): void {
            $table->id();

            $table->foreignId('notification_id')
                ->constrained('notifications')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // delivery
            $table->string('channel', 50); // email, whatsapp
            $table->string('status', 50)->default('pending'); // pending, sent, failed, read

            // tracking
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->text('error_message')->nullable();

            $table->timestamps();

            // indexes for performance
            $table->index(['user_id', 'status']);
            $table->index(['notification_id', 'channel']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_recipients');
    }
};
