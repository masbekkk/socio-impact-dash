<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project_monitoring_documents', function (Blueprint $table): void {
            $table->string('upload_status', 20)->default('completed')->after('size');
            $table->string('temp_path')->nullable()->after('upload_status');
        });
    }

    public function down(): void
    {
        Schema::table('project_monitoring_documents', function (Blueprint $table): void {
            $table->dropColumn(['upload_status', 'temp_path']);
        });
    }
};
