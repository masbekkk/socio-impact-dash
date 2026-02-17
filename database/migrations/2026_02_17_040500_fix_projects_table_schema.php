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
        Schema::table('projects', function (Blueprint $table) {
            if (Schema::hasColumn('projects', 'created_by') && ! Schema::hasColumn('projects', 'user_id')) {
                $table->renameColumn('created_by', 'user_id');
            }

            $table->string('client')->after('name');
            $table->string('sow_path')->nullable()->after('project_type');
            $table->string('sow_original_name')->nullable()->after('sow_path');
            $table->string('sow_mime')->nullable()->after('sow_original_name');
            $table->unsignedBigInteger('sow_size')->nullable()->after('sow_mime');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['client', 'sow_path', 'sow_original_name', 'sow_mime', 'sow_size']);
            if (Schema::hasColumn('projects', 'user_id')) {
                $table->renameColumn('user_id', 'created_by');
            }
        });
    }
};
