<?php

declare(strict_types=1);

use App\Enums\ReimbursementStatus;
use App\Enums\ReimbursementType;
use App\Models\Reimbursement;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

beforeEach(function (): void {
    foreach (['finance', 'pegawai', 'head'] as $role) {
        Role::query()->firstOrCreate(['name' => $role]);
    }
});

test('finance completes a balance EER without transfer proof', function (): void {
    Storage::fake('public');
    $finance = User::factory()->create();
    $finance->assignRole('finance');
    $eer = Reimbursement::factory()->create([
        'type' => ReimbursementType::EER,
        'eer_type' => 'balance',
        'status' => ReimbursementStatus::Requested,
        'transfer_proof_path' => null,
        'transferred_amount' => null,
    ]);

    $this->actingAs($finance)->postJson("/api/v1/reimbursements/{$eer->id}/status", [
        'action' => 'transferred',
    ])->assertOk();

    $eer->refresh();
    expect($eer->status)->toBe(ReimbursementStatus::Closed)
        ->and($eer->transfer_proof_path)->toBeNull()
        ->and($eer->transferred_amount)->toBeNull();
    expect(Storage::disk('public')->allFiles())->toBeEmpty();
});

test('pegawai cannot complete a balance EER through the finance action', function (): void {
    $owner = User::factory()->create();
    $owner->assignRole('pegawai');
    $eer = Reimbursement::factory()->create([
        'user_id' => $owner->id,
        'type' => ReimbursementType::EER,
        'eer_type' => 'balance',
        'status' => ReimbursementStatus::Requested,
        'transfer_proof_path' => null,
    ]);

    $this->actingAs($owner)->postJson("/api/v1/reimbursements/{$eer->id}/status", [
        'action' => 'transferred',
    ])->assertForbidden();

    expect($eer->fresh()->status)->toBe(ReimbursementStatus::Requested);
});

test('other reimbursement transfers still require proof', function (ReimbursementType $type, ?string $eerType): void {
    $finance = User::factory()->create();
    $finance->assignRole('finance');
    $reimbursement = Reimbursement::factory()->create([
        'type' => $type,
        'eer_type' => $eerType,
        'status' => ReimbursementStatus::Requested,
        'transfer_proof_path' => null,
    ]);

    $this->actingAs($finance)->postJson("/api/v1/reimbursements/{$reimbursement->id}/status", [
        'action' => 'transferred',
    ])->assertUnprocessable()->assertJsonValidationErrors('transfer_proof');

    expect($reimbursement->fresh()->status)->toBe(ReimbursementStatus::Requested);
})->with([
    [ReimbursementType::ATR, null],
    [ReimbursementType::EER, 'refund'],
    [ReimbursementType::EER, 'reimbursement'],
]);
