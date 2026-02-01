<?php

declare(strict_types=1);

use App\Enums\ProjectHealth;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table): void {
            $table->foreignId('pc_id')->nullable()->after('pic_id')->constrained('users')->nullOnDelete();
            $table->foreignId('implementation_pic_id')->nullable()->after('pc_id')->constrained('users')->nullOnDelete();
            $table->date('spk_start_date')->nullable()->after('sow');
            $table->date('spk_end_date')->nullable()->after('spk_start_date');
            $table->decimal('nominal_planned', 15, 2)->nullable()->after('budget_total');
            $table->json('financial_projection')->nullable()->after('nominal_planned');
            $table->string('health')->nullable()->default(ProjectHealth::Sehat->value)->after('status');
            $table->string('region', 100)->nullable()->after('health');
            $table->text('notes')->nullable()->after('region');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table): void {
            $table->dropForeign(['pc_id']);
            $table->dropForeign(['implementation_pic_id']);
            $table->dropColumn([
                'pc_id', 'implementation_pic_id', 'spk_start_date', 'spk_end_date',
                'nominal_planned', 'financial_projection', 'health', 'region', 'notes',
            ]);
        });
    }
};
