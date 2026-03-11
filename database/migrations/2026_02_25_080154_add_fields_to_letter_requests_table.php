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
            $table->foreignId('letter_code_id')->nullable()->constrained('letter_codes')->nullOnDelete();
            $table->foreignId('letter_division_id')->nullable()->constrained('letter_divisions')->nullOnDelete();
            $table->text('keterangan')->nullable();
            $table->dropColumn('pic_name');
            $table->foreignId('pic_id')->nullable()->constrained('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('letter_requests', function (Blueprint $table): void {
            $table->dropForeign(['letter_code_id']);
            $table->dropForeign(['letter_division_id']);
            $table->dropForeign(['pic_id']);
            $table->dropColumn(['letter_code_id', 'letter_division_id', 'keterangan', 'pic_id']);
            $table->string('pic_name')->nullable();
        });
    }
};
