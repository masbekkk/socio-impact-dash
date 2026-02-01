<?php

declare(strict_types=1);

use App\Enums\LeaveStatus;
use App\Enums\LeaveType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leaves', function (Blueprint $table): void {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('replacement_pic_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('lokasi')->nullable();
            $table->string('type')->default(LeaveType::Annual->value);
            $table->string('status')->default(LeaveStatus::Draft->value)->index();
            $table->date('start_date');
            $table->date('end_date');
            $table->text('reason')->nullable();
            $table->string('attachment_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leaves');
    }
};
