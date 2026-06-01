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
        Schema::table('letter_requests', function (Blueprint $table): void {
            $table->renameColumn('status', 'approval_status');
        });

        Schema::table('letter_requests', function (Blueprint $table): void {
            $table->enum('status', ['used', 'unused'])->default('used');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('letter_requests', function (Blueprint $table): void {
            $table->dropColumn('status');
        });

        Schema::table('letter_requests', function (Blueprint $table): void {
            $table->renameColumn('approval_status', 'status');
        });
    }
};
