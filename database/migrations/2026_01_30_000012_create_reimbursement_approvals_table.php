<?php

declare(strict_types=1);

use App\Enums\ApprovalRole;
use App\Enums\ApprovalStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reimbursement_approvals', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('reimbursement_id')->constrained('reimbursements')->cascadeOnDelete();
            $table->foreignId('approver_id')->constrained('users')->cascadeOnDelete();
            $table->string('role')->default(ApprovalRole::Head->value);
            $table->string('status')->default(ApprovalStatus::Pending->value);
            $table->text('notes')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reimbursement_approvals');
    }
};
