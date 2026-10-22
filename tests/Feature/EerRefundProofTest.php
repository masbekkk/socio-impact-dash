<?php

declare(strict_types=1);

use App\Enums\ReimbursementStatus;
use App\Enums\ReimbursementType;
use App\Models\Reimbursement;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

beforeEach(function (): void {
    Role::query()->firstOrCreate(['name' => 'pegawai']);
    Role::query()->firstOrCreate(['name' => 'finance']);
    Role::query()->firstOrCreate(['name' => 'head']);
    Storage::fake('public');
});

function refundEerFor(User $owner, ReimbursementStatus $status = ReimbursementStatus::FinanceApproved): Reimbursement
{
    return Reimbursement::factory()->create([
        'user_id' => $owner->id,
        'type' => ReimbursementType::EER,
        'eer_type' => 'refund',
        'status' => $status,
        'transfer_proof_path' => null,
    ]);
}

test('pegawai owner uploads refund proof and marks EER transferred after finance approval', function (): void {
    $owner = User::factory()->create();
    $owner->assignRole('pegawai');
    $eer = refundEerFor($owner);

    $this->actingAs($owner)->post("/api/v1/reimbursements/{$eer->id}/refund-proof", [
        'transfer_proof' => UploadedFile::fake()->create('refund.pdf', 1, 'application/pdf'),
    ])->assertOk();

    $eer->refresh();
    expect($eer->status)->toBe(ReimbursementStatus::Transferred)
        ->and($eer->transferred_at)->not->toBeNull()
        ->and($eer->transfer_proof_path)->not->toBeNull();
    Storage::disk('public')->assertExists($eer->transfer_proof_path);

    $this->post("/api/v1/reimbursements/{$eer->id}/refund-proof", [
        'transfer_proof' => UploadedFile::fake()->create('again.pdf', 1, 'application/pdf'),
    ])->assertStatus(422);
    expect($eer->fresh()->status)->toBe(ReimbursementStatus::Transferred);
});

test('only the pegawai owner can upload refund proof', function (): void {
    $owner = User::factory()->create();
    $owner->assignRole('pegawai');
    $other = User::factory()->create();
    $other->assignRole('pegawai');
    $eer = refundEerFor($owner);

    $this->actingAs($other)->post("/api/v1/reimbursements/{$eer->id}/refund-proof", [
        'transfer_proof' => UploadedFile::fake()->create('refund.pdf', 1, 'application/pdf'),
    ])->assertForbidden();

    expect($eer->fresh()->transfer_proof_path)->toBeNull();
});

test('refund proof upload requires the right EER state and a valid file', function (): void {
    $owner = User::factory()->create();
    $owner->assignRole('pegawai');
    $eer = refundEerFor($owner, ReimbursementStatus::HeadApproved);

    $this->actingAs($owner)->post("/api/v1/reimbursements/{$eer->id}/refund-proof", [
        'transfer_proof' => UploadedFile::fake()->create('refund.pdf', 1, 'application/pdf'),
    ])->assertStatus(422);

    $eer->update(['status' => ReimbursementStatus::FinanceApproved]);
    $this->post("/api/v1/reimbursements/{$eer->id}/refund-proof", [
        'transfer_proof' => UploadedFile::fake()->create('refund.txt', 1, 'text/plain'),
    ])->assertSessionHasErrors('transfer_proof');

    $eer->update(['transfer_proof_path' => 'existing/refund.pdf']);
    $this->post("/api/v1/reimbursements/{$eer->id}/refund-proof", [
        'transfer_proof' => UploadedFile::fake()->create('replacement.pdf', 1, 'application/pdf'),
    ])->assertStatus(422);
    expect($eer->fresh()->transfer_proof_path)->toBe('existing/refund.pdf');
});

test('pegawai cannot close refund EER through the finance status action', function (): void {
    $owner = User::factory()->create();
    $owner->assignRole('pegawai');
    $eer = refundEerFor($owner);

    $this->actingAs($owner)->postJson("/api/v1/reimbursements/{$eer->id}/status", [
        'action' => 'transferred',
        'transfer_proof' => UploadedFile::fake()->create('refund.pdf', 1, 'application/pdf'),
    ])->assertForbidden();

    expect($eer->fresh()->status)->toBe(ReimbursementStatus::FinanceApproved);
});

test('finance verifies an existing employee refund proof without a second upload', function (): void {
    $owner = User::factory()->create();
    $owner->assignRole('pegawai');
    $finance = User::factory()->create();
    $finance->assignRole('finance');
    $eer = refundEerFor($owner);
    $eer->update(['transfer_proof_path' => 'existing/refund.pdf']);

    $this->actingAs($finance)->postJson("/api/v1/reimbursements/{$eer->id}/status", [
        'action' => 'transferred',
    ])->assertOk();

    expect($eer->fresh()->status)->toBe(ReimbursementStatus::Closed)
        ->and($eer->fresh()->transfer_proof_path)->toBe('existing/refund.pdf');
});

test('finance cannot close refund EER before the employee uploads proof', function (): void {
    $owner = User::factory()->create();
    $owner->assignRole('pegawai');
    $finance = User::factory()->create();
    $finance->assignRole('finance');
    $eer = refundEerFor($owner);

    $this->actingAs($finance)->postJson("/api/v1/reimbursements/{$eer->id}/status", [
        'action' => 'transferred',
        'transfer_proof' => UploadedFile::fake()->create('refund.pdf', 1, 'application/pdf'),
    ])->assertStatus(422);

    expect($eer->fresh()->status)->toBe(ReimbursementStatus::FinanceApproved);
});
