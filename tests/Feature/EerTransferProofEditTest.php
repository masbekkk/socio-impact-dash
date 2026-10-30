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
    foreach (['finance', 'pegawai', 'head', 'direktur'] as $role) {
        Role::query()->firstOrCreate(['name' => $role]);
    }

    Storage::fake('public');
});

test('finance replaces an existing EER proof without changing its workflow state', function (string $eerType, ReimbursementStatus $status): void {
    $finance = User::factory()->create();
    $finance->assignRole('finance');
    $oldPath = UploadedFile::fake()->create('old.pdf', 1, 'application/pdf')->store('reimbursements/transfer-proofs', 'public');
    $eer = Reimbursement::factory()->create([
        'type' => ReimbursementType::EER,
        'eer_type' => $eerType,
        'status' => $status,
        'transfer_proof_path' => $oldPath,
        'transferred_at' => now()->subDay(),
        'transferred_amount' => 100000,
    ]);
    $transferredAt = $eer->transferred_at;

    $this->actingAs($finance)->post("/api/v1/reimbursements/{$eer->id}/transfer-proof", [
        'transfer_proof' => UploadedFile::fake()->create('new.pdf', 1, 'application/pdf'),
    ])->assertOk();

    $eer->refresh();
    expect($eer->transfer_proof_path)->not->toBe($oldPath)
        ->and($eer->status)->toBe($status)
        ->and($eer->transferred_at->equalTo($transferredAt))->toBeTrue()
        ->and((float) $eer->transferred_amount)->toBe(100000.0);
    Storage::disk('public')->assertExists($eer->transfer_proof_path);
    Storage::disk('public')->assertMissing($oldPath);
})->with([
    ['refund', ReimbursementStatus::Transferred],
    ['refund', ReimbursementStatus::Closed],
    ['reimbursement', ReimbursementStatus::Closed],
]);

test('the submitting employee cannot replace an EER proof through the finance edit action', function (): void {
    $owner = User::factory()->create();
    $owner->assignRole('pegawai');
    $eer = Reimbursement::factory()->create([
        'user_id' => $owner->id,
        'type' => ReimbursementType::EER,
        'eer_type' => 'refund',
        'status' => ReimbursementStatus::Transferred,
        'transfer_proof_path' => 'reimbursements/transfer-proofs/old.pdf',
    ]);

    $this->actingAs($owner)->post("/api/v1/reimbursements/{$eer->id}/transfer-proof", [
        'transfer_proof' => UploadedFile::fake()->create('new.pdf', 1, 'application/pdf'),
    ])->assertForbidden();

    expect($eer->fresh()->transfer_proof_path)->toBe('reimbursements/transfer-proofs/old.pdf');
});

test('finance cannot use proof editing to upload an initial proof or add one to a balance EER', function (string $eerType, ?string $oldPath): void {
    $finance = User::factory()->create();
    $finance->assignRole('finance');
    $eer = Reimbursement::factory()->create([
        'type' => ReimbursementType::EER,
        'eer_type' => $eerType,
        'status' => ReimbursementStatus::FinanceApproved,
        'transfer_proof_path' => $oldPath,
    ]);

    $this->actingAs($finance)->post("/api/v1/reimbursements/{$eer->id}/transfer-proof", [
        'transfer_proof' => UploadedFile::fake()->create('new.pdf', 1, 'application/pdf'),
    ])->assertUnprocessable();

    expect($eer->fresh()->transfer_proof_path)->toBe($oldPath);
    expect(Storage::disk('public')->allFiles())->toBeEmpty();
})->with([
    ['refund', null],
    ['reimbursement', null],
    ['balance', 'reimbursements/transfer-proofs/old.pdf'],
]);

test('finance proof replacement validates the file', function (): void {
    $finance = User::factory()->create();
    $finance->assignRole('finance');
    $eer = Reimbursement::factory()->create([
        'type' => ReimbursementType::EER,
        'eer_type' => 'refund',
        'status' => ReimbursementStatus::Transferred,
        'transfer_proof_path' => 'reimbursements/transfer-proofs/old.pdf',
    ]);

    $this->actingAs($finance)->postJson("/api/v1/reimbursements/{$eer->id}/transfer-proof", [])->assertJsonValidationErrors('transfer_proof');
    $this->postJson("/api/v1/reimbursements/{$eer->id}/transfer-proof", [
        'transfer_proof' => UploadedFile::fake()->create('bad.txt', 1, 'text/plain'),
    ])->assertJsonValidationErrors('transfer_proof');

    expect($eer->fresh()->transfer_proof_path)->toBe('reimbursements/transfer-proofs/old.pdf');
});
