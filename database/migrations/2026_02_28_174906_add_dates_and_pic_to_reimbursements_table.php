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
        Schema::table('reimbursements', function (Blueprint $table) {
            $table->date('start_date')->nullable()->after('usage_plan');
            $table->date('end_date')->nullable()->after('start_date');
            $table->foreignId('replacement_pic_id')->nullable()->after('end_date')->constrained('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reimbursements', function (Blueprint $table) {
            $table->dropForeign(['replacement_pic_id']);
            $table->dropColumn(['start_date', 'end_date', 'replacement_pic_id']);
        });
    }
};
