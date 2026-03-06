<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For development robustness and SQLite compatibility, we'll recreate the table
        // since we want to transform the whole structure for the new Calendar system.

        $existingEvents = DB::table('project_events')->get();

        Schema::dropIfExists('project_events');

        Schema::create('project_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->date('event_date')->nullable(); // Keeping for backward compatibility temporarily
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        foreach ($existingEvents as $event) {
            DB::table('project_events')->insert([
                'id' => $event->id,
                'project_id' => $event->project_id,
                'created_by' => $event->created_by,
                'name' => $event->notes ?? 'Project Event',
                'start_date' => $event->event_date,
                'event_date' => $event->event_date,
                'notes' => $event->notes,
                'created_at' => $event->created_at,
                'updated_at' => $event->updated_at,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We don't necessarily need to perfectly reverse it for dev, but
        // to be safe we'll recreate the old structure.
        Schema::dropIfExists('project_events');
        Schema::create('project_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->date('event_date');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }
};
