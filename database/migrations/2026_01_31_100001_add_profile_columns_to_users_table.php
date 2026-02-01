<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->foreignId('division_id')->nullable()->after('id')->constrained('divisions')->nullOnDelete();
            $table->string('nip', 50)->nullable()->after('division_id');
            $table->string('position', 100)->nullable()->after('nip');
            $table->date('join_date')->nullable()->after('position');
            $table->string('phone', 30)->nullable()->after('email_verified_at');
            $table->string('location', 200)->nullable()->after('phone');
            $table->text('address')->nullable()->after('location');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropForeign(['division_id']);
            $table->dropColumn([
                'division_id', 'nip', 'position', 'join_date',
                'phone', 'location', 'address',
            ]);
        });
    }
};
