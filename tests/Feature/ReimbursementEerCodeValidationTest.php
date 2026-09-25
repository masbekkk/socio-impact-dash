<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\ReimbursementStatus;
use App\Enums\ReimbursementType;
use App\Enums\UserRole;
use App\Models\Division;
use App\Models\Reimbursement;
use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function (): void {
    $roles = [
        UserRole::Superadmin->value,
        UserRole::Head->value,
        UserRole::Finance->value,
        UserRole::Direktur->value,
        UserRole::HR->value,
        UserRole::Pegawai->value,
    ];

    foreach ($roles as $roleName) {
        Role::query()->firstOrCreate(['name' => $roleName]);
    }

    if (Division::query()->count() === 0) {
        Division::factory()->create();
    }
});

test('submitting EER without code fails validation with 422', function (): void {
    $user = User::factory()->create();
    $user->assignRole(UserRole::Pegawai->value);

    $head = User::factory()->create();
    $head->assignRole(UserRole::Head->value);

    $this->actingAs($user);

    $response = $this->postJson('/api/v1/reimbursements', [
        'type' => 'eer',
        'status' => 'submitted',
        'approver_head_id' => $head->id,
        'amount' => 150000,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['code'])
        ->assertJsonFragment([
            'Nomor EER wajib diisi saat melakukan pengajuan.',
        ]);
});

test('saving EER as draft without code succeeds', function (): void {
    $user = User::factory()->create();
    $user->assignRole(UserRole::Pegawai->value);

    $head = User::factory()->create();
    $head->assignRole(UserRole::Head->value);

    $this->actingAs($user);

    $response = $this->postJson('/api/v1/reimbursements', [
        'type' => 'eer',
        'status' => 'draft',
        'approver_head_id' => $head->id,
    ]);

    $response->assertStatus(201);

    $this->assertDatabaseHas('reimbursements', [
        'user_id' => $user->id,
        'type' => ReimbursementType::EER->value,
        'status' => ReimbursementStatus::Draft->value,
        'code' => null,
    ]);
});

test('submitting EER with unique code succeeds', function (): void {
    $user = User::factory()->create();
    $user->assignRole(UserRole::Pegawai->value);

    $head = User::factory()->create();
    $head->assignRole(UserRole::Head->value);

    $this->actingAs($user);

    $response = $this->postJson('/api/v1/reimbursements', [
        'type' => 'eer',
        'status' => 'submitted',
        'code' => 'EER-2026-TEST-001',
        'approver_head_id' => $head->id,
        'amount' => 200000,
    ]);

    $response->assertStatus(201);

    $this->assertDatabaseHas('reimbursements', [
        'user_id' => $user->id,
        'type' => ReimbursementType::EER->value,
        'status' => ReimbursementStatus::Submitted->value,
        'code' => 'EER-2026-TEST-001',
    ]);
});

test('submitting EER with duplicate code fails validation', function (): void {
    $existing = Reimbursement::factory()->create([
        'code' => 'EER-EXISTING-CODE',
        'type' => ReimbursementType::EER,
    ]);

    $user = User::factory()->create();
    $user->assignRole(UserRole::Pegawai->value);

    $head = User::factory()->create();
    $head->assignRole(UserRole::Head->value);

    $this->actingAs($user);

    $response = $this->postJson('/api/v1/reimbursements', [
        'type' => 'eer',
        'status' => 'submitted',
        'code' => 'EER-EXISTING-CODE',
        'approver_head_id' => $head->id,
        'amount' => 200000,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['code'])
        ->assertJsonFragment([
            'Nomor EER sudah digunakan.',
        ]);
});

test('submitting ATR without code succeeds because code is optional for ATR', function (): void {
    $user = User::factory()->create();
    $user->assignRole(UserRole::Pegawai->value);

    $head = User::factory()->create();
    $head->assignRole(UserRole::Head->value);

    $this->actingAs($user);

    $response = $this->postJson('/api/v1/reimbursements', [
        'type' => 'atr',
        'status' => 'submitted',
        'approver_head_id' => $head->id,
        'amount' => 300000,
    ]);

    $response->assertStatus(201);
});

test('submitting Allowance without code succeeds because code is optional for Allowance', function (): void {
    $user = User::factory()->create();
    $user->assignRole(UserRole::Pegawai->value);

    $head = User::factory()->create();
    $head->assignRole(UserRole::Head->value);

    $this->actingAs($user);

    $response = $this->postJson('/api/v1/reimbursements', [
        'type' => 'allowance',
        'status' => 'submitted',
        'approver_head_id' => $head->id,
        'amount' => 100000,
        'end_date' => now()->addDays(2)->format('Y-m-d'),
    ]);

    $response->assertStatus(201);
});

test('resubmitting EER in revision status that already has code succeeds without passing code', function (): void {
    $user = User::factory()->create();
    $user->assignRole(UserRole::Pegawai->value);

    $reimbursement = Reimbursement::factory()->create([
        'user_id' => $user->id,
        'type' => ReimbursementType::EER,
        'status' => ReimbursementStatus::Revision,
        'code' => 'EER-2026-REV-01',
    ]);

    $this->actingAs($user);

    $response = $this->postJson("/api/v1/reimbursements/{$reimbursement->id}/resubmit", [
        'usage_plan' => 'Updated revision usage plan',
    ]);

    $response->assertStatus(200);

    $reimbursement->refresh();
    expect($reimbursement->code)->toBe('EER-2026-REV-01')
        ->and($reimbursement->status)->toBe(ReimbursementStatus::Revised);
});

test('resubmitting EER in revision status that already has code succeeds when passing the same code', function (): void {
    $user = User::factory()->create();
    $user->assignRole(UserRole::Pegawai->value);

    $reimbursement = Reimbursement::factory()->create([
        'user_id' => $user->id,
        'type' => ReimbursementType::EER,
        'status' => ReimbursementStatus::Revision,
        'code' => 'EER-2026-REV-02',
    ]);

    $this->actingAs($user);

    $response = $this->postJson("/api/v1/reimbursements/{$reimbursement->id}/resubmit", [
        'code' => 'EER-2026-REV-02',
        'usage_plan' => 'Updated revision usage plan with code passed',
    ]);

    $response->assertStatus(200);

    $reimbursement->refresh();
    expect($reimbursement->code)->toBe('EER-2026-REV-02')
        ->and($reimbursement->status)->toBe(ReimbursementStatus::Revised);
});

test('resubmitting EER without existing code fails validation if submitted without code', function (): void {
    $user = User::factory()->create();
    $user->assignRole(UserRole::Pegawai->value);

    $reimbursement = Reimbursement::factory()->create([
        'user_id' => $user->id,
        'type' => ReimbursementType::EER,
        'status' => ReimbursementStatus::Draft,
        'code' => null,
    ]);

    $this->actingAs($user);

    $response = $this->postJson("/api/v1/reimbursements/{$reimbursement->id}/resubmit", [
        'status' => 'submitted',
        'usage_plan' => 'Updated usage plan',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['code']);
});

test('resubmitting EER with status draft without code succeeds', function (): void {
    $user = User::factory()->create();
    $user->assignRole(UserRole::Pegawai->value);

    $reimbursement = Reimbursement::factory()->create([
        'user_id' => $user->id,
        'type' => ReimbursementType::EER,
        'status' => ReimbursementStatus::Draft,
        'code' => null,
    ]);

    $this->actingAs($user);

    $response = $this->postJson("/api/v1/reimbursements/{$reimbursement->id}/resubmit", [
        'status' => 'draft',
        'usage_plan' => 'Updated draft usage plan',
    ]);

    $response->assertStatus(200);
});

test('web route submitting EER without code fails with session errors', function (): void {
    $user = User::factory()->create();
    $user->assignRole(UserRole::Pegawai->value);

    $head = User::factory()->create();
    $head->assignRole(UserRole::Head->value);

    $this->actingAs($user);

    $response = $this->post('/reimbursements', [
        'type' => 'eer',
        'status' => 'submitted',
        'approver_head_id' => $head->id,
        'amount' => 150000,
    ]);

    $response->assertSessionHasErrors(['code']);
});

test('web route saving EER as draft without code redirects to index', function (): void {
    $user = User::factory()->create();
    $user->assignRole(UserRole::Pegawai->value);

    $head = User::factory()->create();
    $head->assignRole(UserRole::Head->value);

    $this->actingAs($user);

    $response = $this->post('/reimbursements', [
        'type' => 'eer',
        'status' => 'draft',
        'approver_head_id' => $head->id,
    ]);

    $response->assertRedirect(route('reimbursements.index'));
    $this->assertDatabaseHas('reimbursements', [
        'user_id' => $user->id,
        'type' => ReimbursementType::EER->value,
        'status' => ReimbursementStatus::Draft->value,
        'code' => null,
    ]);
});
