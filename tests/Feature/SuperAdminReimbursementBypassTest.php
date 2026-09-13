<?php

declare(strict_types=1);

use App\Enums\ReimbursementStatus;
use App\Enums\UserRole;
use App\Models\Division;
use App\Models\Project;
use App\Models\Reimbursement;
use App\Models\User;
use Spatie\Permission\Models\Permission;
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

    $permissions = [
        'approve_reimbursements',
        'reject_reimbursements',
        'view_reimbursements',
        'create_reimbursements',
    ];

    foreach ($permissions as $permName) {
        Permission::query()->firstOrCreate(['name' => $permName]);
    }

    if (Division::query()->count() === 0) {
        Division::factory()->create();
    }
});

test('superadmin can approve reimbursement without having any data dependencies', function (): void {
    $superadmin = User::factory()->create();
    $superadmin->assignRole(UserRole::Superadmin->value);

    $creator = User::factory()->create();
    $creator->assignRole(UserRole::Pegawai->value);

    $head = User::factory()->create();
    $head->assignRole(UserRole::Head->value);

    $project = Project::factory()->create([
        'head_id' => $head->id,
        'pic_id' => $head->id,
        'created_by' => $head->id,
    ]);

    $reimbursement = Reimbursement::factory()->create([
        'user_id' => $creator->id,
        'project_id' => $project->id,
        'status' => ReimbursementStatus::Submitted,
    ]);

    $reimbursement->approvals()->create([
        'approver_id' => $head->id,
        'role' => 'head',
        'status' => 'pending',
    ]);

    $this->actingAs($superadmin);

    // Superadmin approves with role: superadmin
    $response = $this->postJson("/api/v1/reimbursements/{$reimbursement->id}/status", [
        'action' => 'approved',
        'role' => 'superadmin',
        'notes' => 'Approved by Superadmin',
    ]);

    $response->assertOk();

    $reimbursement->refresh();
    expect($reimbursement->status)->toBe(ReimbursementStatus::Approved);

    // Approval records should also be marked approved
    $approval = $reimbursement->approvals()->first();
    expect($approval?->status->value)->toBe('approved');
});

test('superadmin can request fund directly even when not assigned in approvals', function (): void {
    $superadmin = User::factory()->create();
    $superadmin->assignRole(UserRole::Superadmin->value);

    $creator = User::factory()->create();
    $reimbursement = Reimbursement::factory()->create([
        'user_id' => $creator->id,
        'status' => ReimbursementStatus::Approved,
    ]);

    $this->actingAs($superadmin);

    $response = $this->postJson("/api/v1/reimbursements/{$reimbursement->id}/status", [
        'action' => 'request_fund',
        'role' => 'superadmin',
    ]);

    $response->assertOk();

    $reimbursement->refresh();
    expect($reimbursement->status)->toBe(ReimbursementStatus::Requested);
});

test('superadmin can reject or request revision on any reimbursement', function (): void {
    $superadmin = User::factory()->create();
    $superadmin->assignRole(UserRole::Superadmin->value);

    $creator = User::factory()->create();
    $reimbursement = Reimbursement::factory()->create([
        'user_id' => $creator->id,
        'status' => ReimbursementStatus::Submitted,
    ]);

    $this->actingAs($superadmin);

    $response = $this->postJson("/api/v1/reimbursements/{$reimbursement->id}/status", [
        'action' => 'revision',
        'role' => 'superadmin',
        'notes' => 'Needs more details',
    ]);

    $response->assertOk();

    $reimbursement->refresh();
    expect($reimbursement->status)->toBe(ReimbursementStatus::Revision);
});

test('superadmin can resubmit reimbursement even when not the owner', function (): void {
    $superadmin = User::factory()->create();
    $superadmin->assignRole(UserRole::Superadmin->value);

    $creator = User::factory()->create();
    $reimbursement = Reimbursement::factory()->create([
        'user_id' => $creator->id,
        'status' => ReimbursementStatus::Revision,
    ]);

    $this->actingAs($superadmin);

    $response = $this->postJson("/api/v1/reimbursements/{$reimbursement->id}/resubmit", [
        'status' => 'submitted',
        'usage_plan' => 'Updated usage plan by superadmin',
    ]);

    $response->assertOk();

    $reimbursement->refresh();
    expect($reimbursement->usage_plan)->toBe('Updated usage plan by superadmin');
});

test('superadmin can access edit page of non-owned and non-draft reimbursement', function (): void {
    $superadmin = User::factory()->create();
    $superadmin->assignRole(UserRole::Superadmin->value);

    $creator = User::factory()->create();
    $reimbursement = Reimbursement::factory()->create([
        'user_id' => $creator->id,
        'status' => ReimbursementStatus::Submitted,
        'type' => App\Enums\ReimbursementType::ATR,
    ]);

    $this->actingAs($superadmin);

    $response = $this->get("/reimbursements/{$reimbursement->id}/edit");
    $response->assertOk();
});

test('non-superadmin is blocked from resubmitting other users reimbursement', function (): void {
    $otherUser = User::factory()->create();
    $otherUser->assignRole(UserRole::Pegawai->value);

    $creator = User::factory()->create();
    $reimbursement = Reimbursement::factory()->create([
        'user_id' => $creator->id,
        'status' => ReimbursementStatus::Revision,
    ]);

    $this->actingAs($otherUser);

    $response = $this->postJson("/api/v1/reimbursements/{$reimbursement->id}/resubmit", [
        'status' => 'submitted',
        'usage_plan' => 'Attempted hijack',
    ]);

    $response->assertStatus(403);
});

test('superadmin can transfer reimbursement bypassing transfer proof requirement', function (): void {
    $superadmin = User::factory()->create();
    $superadmin->assignRole(UserRole::Superadmin->value);

    $creator = User::factory()->create();
    $reimbursement = Reimbursement::factory()->create([
        'user_id' => $creator->id,
        'status' => ReimbursementStatus::Requested,
        'type' => App\Enums\ReimbursementType::ATR,
    ]);

    $this->actingAs($superadmin);

    $response = $this->postJson("/api/v1/reimbursements/{$reimbursement->id}/status", [
        'action' => 'transferred',
        'role' => 'superadmin',
        'transferred_amount' => 500000,
    ]);

    $response->assertOk();

    $reimbursement->refresh();
    expect($reimbursement->status)->toBe(ReimbursementStatus::Transferred);
});

test('superadmin can bulk approve reimbursements via web controller', function (): void {
    $superadmin = User::factory()->create();
    $superadmin->assignRole(UserRole::Superadmin->value);

    $creator = User::factory()->create();
    $r1 = Reimbursement::factory()->create(['user_id' => $creator->id, 'status' => ReimbursementStatus::Submitted]);
    $r2 = Reimbursement::factory()->create(['user_id' => $creator->id, 'status' => ReimbursementStatus::Submitted]);

    $this->actingAs($superadmin);

    $response = $this->post('/reimbursements/bulk-approve', [
        'ids' => [$r1->id, $r2->id],
    ]);

    $response->assertRedirect();

    $r1->refresh();
    $r2->refresh();
    expect($r1->status)->toBe(ReimbursementStatus::Approved)
        ->and($r2->status)->toBe(ReimbursementStatus::Approved);
});
