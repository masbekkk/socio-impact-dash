<?php

declare(strict_types=1);

use App\Enums\LeaveStatus;
use App\Enums\UserRole;
use App\Models\Leave;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('hr can approve leave skipping head', function (): void {
    $pegawai = User::factory()->create();
    $pegawai->assignRole(UserRole::Pegawai->value);

    $hr = User::factory()->create();
    $hr->assignRole(UserRole::HR->value);

    $leave = Leave::factory()->create([
        'user_id' => $pegawai->id,
        'status' => LeaveStatus::Submitted,
        'code' => 'CUTI-TEST-001',
    ]);

    $response = $this->actingAs($hr)->postJson("/api/v1/leaves/{$leave->code}/status", [
        'action' => 'approve',
        'notes' => 'Approved by HR early',
    ]);

    $response->assertStatus(200);

    $this->assertDatabaseHas('leaves', [
        'id' => $leave->id,
        'status' => LeaveStatus::HRApproved->value,
    ]);

    $this->assertDatabaseHas('leave_approvals', [
        'leave_id' => $leave->id,
        'role' => 'hr',
        'status' => 'approved',
        'notes' => 'Approved by HR early',
    ]);
});

test('superadmin can approve at any stage', function (): void {
    $pegawai = User::factory()->create();
    $pegawai->assignRole(UserRole::Pegawai->value);

    $superadmin = User::factory()->create();
    $superadmin->assignRole(UserRole::Superadmin->value);

    $leave = Leave::factory()->create([
        'user_id' => $pegawai->id,
        'status' => LeaveStatus::Submitted,
        'code' => 'CUTI-TEST-002',
    ]);

    $response = $this->actingAs($superadmin)->postJson("/api/v1/leaves/{$leave->code}/status", [
        'action' => 'approve',
        'notes' => 'Approved by Superadmin early',
    ]);

    $response->assertStatus(200);

    $this->assertDatabaseHas('leaves', [
        'id' => $leave->id,
        'status' => LeaveStatus::SuperAdminApproved->value,
    ]);

    $this->assertDatabaseHas('leave_approvals', [
        'leave_id' => $leave->id,
        'role' => 'superadmin',
        'status' => 'approved',
    ]);
});

test('hr can reject leave', function (): void {
    $pegawai = User::factory()->create();
    $pegawai->assignRole(UserRole::Pegawai->value);

    $hr = User::factory()->create();
    $hr->assignRole(UserRole::HR->value);

    $leave = Leave::factory()->create([
        'user_id' => $pegawai->id,
        'status' => LeaveStatus::Submitted,
        'code' => 'CUTI-TEST-003',
    ]);

    $response = $this->actingAs($hr)->postJson("/api/v1/leaves/{$leave->code}/status", [
        'action' => 'reject',
        'notes' => 'Rejected by HR',
    ]);

    $response->assertStatus(200);

    $this->assertDatabaseHas('leaves', [
        'id' => $leave->id,
        'status' => LeaveStatus::Rejected->value,
    ]);

    $this->assertDatabaseHas('leave_approvals', [
        'leave_id' => $leave->id,
        'role' => 'hr',
        'status' => 'rejected',
    ]);
});
