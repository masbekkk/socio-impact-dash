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
        Schema::table('projects', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->after('id');
            $table->text('lesson_learned')->nullable()->after('end_date');
        });

        // Initialize UUIDs for existing records
        $projects = \Illuminate\Support\Facades\DB::table('projects')->whereNull('uuid')->get();
        foreach ($projects as $project) {
            \Illuminate\Support\Facades\DB::table('projects')
                ->where('id', $project->id)
                ->update(['uuid' => \Illuminate\Support\Str::uuid()->toString()]);
        }

        // Make it unique and not nullable
        Schema::table('projects', function (Blueprint $table) {
            $table->uuid('uuid')->nullable(false)->unique()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['uuid', 'lesson_learned']);
        });
    }
};
