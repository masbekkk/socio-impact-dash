<?php

declare(strict_types=1);

namespace Tests\Feature\Api\V1;

use App\Enums\LeaveStatus;
use App\Enums\UserRole;
use App\Models\Leave;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class LeaveApprovalFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleAndPermissionSeeder::class);
    }

    public function test_pegawai_approval_flow(): void
    {
        $pegawai = User::factory()->create();
        $pegawai->assignRole(UserRole::Pegawai->value);

        $head = User::factory()->create();
        $head->assignRole(UserRole::Head->value);

        $hr = User::factory()->create();
        $hr->assignRole(UserRole::HR->value);

        $leave = Leave::factory()->create([
            'user_id' => $pegawai->id,
            'status' => LeaveStatus::Submitted,
        ]);

        // Head approves
        $this->actingAs($head)->postJson("/api/v1/leaves/{$leave->code}/status", [
            'action' => 'approve',
        ])->assertStatus(200);

        $this->assertEquals(LeaveStatus::HeadApproved, $leave->fresh()->status);

        // HR approves
        $this->actingAs($hr)->postJson("/api/v1/leaves/{$leave->code}/status", [
            'action' => 'approve',
        ])->assertStatus(200);

        $this->assertEquals(LeaveStatus::HRApproved, $leave->fresh()->status);
    }

    public function test_head_approval_flow(): void
    {
        $headUser = User::factory()->create();
        $headUser->assignRole(UserRole::Head->value);

        $hr = User::factory()->create();
        $hr->assignRole(UserRole::HR->value);

        $direktur = User::factory()->create();
        $direktur->assignRole(UserRole::Direktur->value);

        $leave = Leave::factory()->create([
            'user_id' => $headUser->id,
            'status' => LeaveStatus::Submitted,
        ]);

        // HR approves
        $this->actingAs($hr)->postJson("/api/v1/leaves/{$leave->code}/status", [
            'action' => 'approve',
        ])->assertStatus(200);

        $this->assertEquals(LeaveStatus::HRApproved, $leave->fresh()->status);

        // Direktur approves
        $this->actingAs($direktur)->postJson("/api/v1/leaves/{$leave->code}/status", [
            'action' => 'approve',
        ])->assertStatus(200);

        $this->assertEquals(LeaveStatus::SuperAdminApproved, $leave->fresh()->status);
    }

    public function test_rejection_always_sets_rejected_status(): void
    {
        $pegawai = User::factory()->create();
        $pegawai->assignRole(UserRole::Pegawai->value);

        $head = User::factory()->create();
        $head->assignRole(UserRole::Head->value);

        $leave = Leave::factory()->create([
            'user_id' => $pegawai->id,
            'status' => LeaveStatus::Submitted,
        ]);

        // Head rejects
        $this->actingAs($head)->postJson("/api/v1/leaves/{$leave->code}/status", [
            'action' => 'reject',
            'notes' => 'Not allowed',
        ])->assertStatus(200);

        $this->assertEquals(LeaveStatus::Rejected, $leave->fresh()->status);
    }
}
