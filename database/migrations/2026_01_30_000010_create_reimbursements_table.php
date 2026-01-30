<?php

declare(strict_types=1);

use App\Enums\ReimbursementStatus;
use App\Enums\ReimbursementType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reimbursements', function (Blueprint $table): void {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete();
            $table->string('type')->default(ReimbursementType::ATR->value);
            $table->string('status')->default(ReimbursementStatus::Draft->value)->index();
            $table->decimal('amount', 15, 2);
            $table->string('bank_name')->nullable();
            $table->string('bank_account')->nullable();
            $table->string('account_holder')->nullable();
            $table->timestamp('transferred_at')->nullable();
            $table->string('transfer_proof_path')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reimbursements');
    }
};
