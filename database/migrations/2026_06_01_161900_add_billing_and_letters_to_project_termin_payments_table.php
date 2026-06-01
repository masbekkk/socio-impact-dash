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
        Schema::table('project_termin_payments', function (Blueprint $table): void {
            $table->string('nomor_surat')->nullable()->after('notes');
            $table->string('tertuju')->nullable()->after('nomor_surat');
            $table->string('billing_document')->nullable()->after('tertuju');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_termin_payments', function (Blueprint $table): void {
            $table->dropColumn(['nomor_surat', 'tertuju', 'billing_document']);
        });
    }
};
