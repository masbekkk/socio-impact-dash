<?php

declare(strict_types=1);

use App\Enums\ReimbursementStatus;
use App\Enums\ReimbursementType;
use App\Models\Project;
use App\Models\Reimbursement;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

beforeEach(function (): void {
    foreach (['finance', 'pegawai', 'head', 'direktur', 'superadmin'] as $role) {
        Role::query()->firstOrCreate(['name' => $role]);
    }

    Storage::fake('public');
});

test('finance can edit transfer proof and nominal for ATR without EER', function (): void {
    $finance = User::factory()->create();
    $finance->assignRole('finance');

    $oldPath = UploadedFile::fake()->create('old_receipt.pdf', 10, 'application/pdf')->store('reimbursements/transfer-proofs', 'public');
    $atr = Reimbursement::factory()->create([
        'type' => ReimbursementType::ATR,
        'status' => ReimbursementStatus::Transferred,
        'amount' => 5000000,
        'transferred_amount' => 5000000,
        'transfer_proof_path' => $oldPath,
        'transferred_at' => now()->subDays(2),
    ]);

    $response = $this->actingAs($finance)->postJson("/api/v1/reimbursements/{$atr->id}/transfer-proof", [
        'transfer_proof' => UploadedFile::fake()->create('new_receipt.pdf', 10, 'application/pdf'),
        'transferred_amount' => 4500000,
    ]);

    $response->assertOk();

    $atr->refresh();
    expect($atr->transfer_proof_path)->not->toBe($oldPath)
        ->and((float) $atr->amount)->toBe(4500000.0)
        ->and((float) $atr->transferred_amount)->toBe(4500000.0)
        ->and($atr->status)->toBe(ReimbursementStatus::Transferred);

    Storage::disk('public')->assertExists($atr->transfer_proof_path);
    Storage::disk('public')->assertMissing($oldPath);
});

test('finance can edit only transfer proof for ATR without changing nominal', function (): void {
    $finance = User::factory()->create();
    $finance->assignRole('finance');

    $oldPath = UploadedFile::fake()->create('old.pdf', 10, 'application/pdf')->store('reimbursements/transfer-proofs', 'public');
    $atr = Reimbursement::factory()->create([
        'type' => ReimbursementType::ATR,
        'status' => ReimbursementStatus::Transferred,
        'amount' => 3000000,
        'transferred_amount' => 3000000,
        'transfer_proof_path' => $oldPath,
    ]);

    $response = $this->actingAs($finance)->postJson("/api/v1/reimbursements/{$atr->id}/transfer-proof", [
        'transfer_proof' => UploadedFile::fake()->create('new.pdf', 10, 'application/pdf'),
    ]);

    $response->assertOk();

    $atr->refresh();
    expect($atr->transfer_proof_path)->not->toBe($oldPath)
        ->and((float) $atr->amount)->toBe(3000000.0)
        ->and((float) $atr->transferred_amount)->toBe(3000000.0);

    Storage::disk('public')->assertExists($atr->transfer_proof_path);
    Storage::disk('public')->assertMissing($oldPath);
});

test('finance can edit only nominal for ATR without re-uploading file', function (): void {
    $finance = User::factory()->create();
    $finance->assignRole('finance');

    $oldPath = UploadedFile::fake()->create('existing.pdf', 10, 'application/pdf')->store('reimbursements/transfer-proofs', 'public');
    $atr = Reimbursement::factory()->create([
        'type' => ReimbursementType::ATR,
        'status' => ReimbursementStatus::Transferred,
        'amount' => 3000000,
        'transferred_amount' => 3000000,
        'transfer_proof_path' => $oldPath,
    ]);

    $response = $this->actingAs($finance)->postJson("/api/v1/reimbursements/{$atr->id}/transfer-proof", [
        'transferred_amount' => 3500000,
    ]);

    $response->assertOk();

    $atr->refresh();
    expect($atr->transfer_proof_path)->toBe($oldPath)
        ->and((float) $atr->amount)->toBe(3500000.0)
        ->and((float) $atr->transferred_amount)->toBe(3500000.0);

    Storage::disk('public')->assertExists($oldPath);
});

test('finance CANNOT edit nominal for ATR if ATR already has an active EER', function (): void {
    $finance = User::factory()->create();
    $finance->assignRole('finance');

    $project = Project::factory()->create();
    $atr = Reimbursement::factory()->create([
        'project_id' => $project->id,
        'type' => ReimbursementType::ATR,
        'status' => ReimbursementStatus::Transferred,
        'amount' => 5000000,
        'transferred_amount' => 5000000,
    ]);

    $eer = Reimbursement::factory()->create([
        'project_id' => $project->id,
        'type' => ReimbursementType::EER,
        'eer_type' => 'refund',
        'atr_id' => $atr->id,
        'status' => ReimbursementStatus::Requested,
        'amount' => 4000000,
    ]);

    $response = $this->actingAs($finance)->postJson("/api/v1/reimbursements/{$atr->id}/transfer-proof", [
        'transferred_amount' => 4500000,
    ]);

    $response->assertStatus(422)
        ->assertJson([
            'message' => 'ATR sudah memiliki EER. Hapus EER terlebih dahulu untuk mengubah nominal transfer.',
        ]);

    $atr->refresh();
    expect((float) $atr->amount)->toBe(5000000.0)
        ->and((float) $atr->transferred_amount)->toBe(5000000.0);
});

test('finance CAN replace transfer proof for ATR with existing EER if nominal is not modified', function (): void {
    $finance = User::factory()->create();
    $finance->assignRole('finance');

    $oldPath = UploadedFile::fake()->create('old.pdf', 10, 'application/pdf')->store('reimbursements/transfer-proofs', 'public');
    $project = Project::factory()->create();
    $atr = Reimbursement::factory()->create([
        'project_id' => $project->id,
        'type' => ReimbursementType::ATR,
        'status' => ReimbursementStatus::Transferred,
        'amount' => 5000000,
        'transferred_amount' => 5000000,
        'transfer_proof_path' => $oldPath,
    ]);

    Reimbursement::factory()->create([
        'project_id' => $project->id,
        'type' => ReimbursementType::EER,
        'eer_type' => 'refund',
        'atr_id' => $atr->id,
        'status' => ReimbursementStatus::Requested,
        'amount' => 4000000,
    ]);

    $response = $this->actingAs($finance)->postJson("/api/v1/reimbursements/{$atr->id}/transfer-proof", [
        'transfer_proof' => UploadedFile::fake()->create('new.pdf', 10, 'application/pdf'),
        'transferred_amount' => 5000000,
    ]);

    $response->assertOk();

    $atr->refresh();
    expect($atr->transfer_proof_path)->not->toBe($oldPath)
        ->and((float) $atr->amount)->toBe(5000000.0)
        ->and((float) $atr->transferred_amount)->toBe(5000000.0);

    Storage::disk('public')->assertExists($atr->transfer_proof_path);
    Storage::disk('public')->assertMissing($oldPath);
});

test('after deleting all connected EERs, finance can edit nominal for ATR', function (): void {
    $finance = User::factory()->create();
    $finance->assignRole('finance');

    $project = Project::factory()->create();
    $atr = Reimbursement::factory()->create([
        'project_id' => $project->id,
        'type' => ReimbursementType::ATR,
        'status' => ReimbursementStatus::Transferred,
        'amount' => 5000000,
        'transferred_amount' => 5000000,
    ]);

    $eer = Reimbursement::factory()->create([
        'project_id' => $project->id,
        'type' => ReimbursementType::EER,
        'eer_type' => 'refund',
        'atr_id' => $atr->id,
        'status' => ReimbursementStatus::Requested,
        'amount' => 4000000,
    ]);

    // Deleting the EER (soft delete)
    $this->actingAs($finance)->deleteJson("/api/v1/reimbursements/{$eer->id}")->assertOk();

    expect($atr->eers()->count())->toBe(0);

    // Now editing nominal should succeed
    $response = $this->actingAs($finance)->postJson("/api/v1/reimbursements/{$atr->id}/transfer-proof", [
        'transferred_amount' => 4200000,
    ]);

    $response->assertOk();

    $atr->refresh();
    expect((float) $atr->amount)->toBe(4200000.0)
        ->and((float) $atr->transferred_amount)->toBe(4200000.0);
});

test('regular employee cannot edit ATR transfer details', function (): void {
    $pegawai = User::factory()->create();
    $pegawai->assignRole('pegawai');

    $atr = Reimbursement::factory()->create([
        'type' => ReimbursementType::ATR,
        'status' => ReimbursementStatus::Transferred,
        'amount' => 5000000,
        'transferred_amount' => 5000000,
    ]);

    $response = $this->actingAs($pegawai)->postJson("/api/v1/reimbursements/{$atr->id}/transfer-proof", [
        'transferred_amount' => 4000000,
    ]);

    $response->assertForbidden();
});

test('cannot edit ATR transfer details if ATR is not in transferred status', function (): void {
    $finance = User::factory()->create();
    $finance->assignRole('finance');

    $atr = Reimbursement::factory()->create([
        'type' => ReimbursementType::ATR,
        'status' => ReimbursementStatus::FinanceApproved,
        'amount' => 5000000,
    ]);

    $response = $this->actingAs($finance)->postJson("/api/v1/reimbursements/{$atr->id}/transfer-proof", [
        'transferred_amount' => 4000000,
    ]);

    $response->assertStatus(422);
});
