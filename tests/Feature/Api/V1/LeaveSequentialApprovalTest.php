<?php

declare(strict_types=1);

namespace Tests\Feature\Api\V1;

use App\Actions\CreateLeave;
use App\Enums\ApprovalStatus;
use App\Enums\LeaveStatus;
use App\Enums\UserRole;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class LeaveSequentialApprovalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleAndPermissionSeeder::class);
    }

    public function test_pegawai_leave_does_not_have_direktur_approval(): void
    {
        $pegawai = User::factory()->create();
        $pegawai->assignRole(UserRole::Pegawai->value);

        // Seed required users for CreateLeave action
        User::factory()->create(['email' => 'hr@socio-impact.test'])->assignRole(UserRole::HR->value);
        User::factory()->create(['email' => 'direktur@socio-impact.test'])->assignRole(UserRole::Direktur->value);

        $createLeave = resolve(CreateLeave::class);
        $leave = $createLeave->handle([
            'type' => 'annual',
            'start_date' => now()->addDay()->toDateString(),
            'end_date' => now()->addDays(2)->toDateString(),
            'approver_head_id' => User::factory()->create()->id,
        ], $pegawai->id);

        $this->assertFalse($leave->approvals()->where('role', 'direktur')->exists());
        $this->assertTrue($leave->approvals()->where('role', 'head')->exists());
        $this->assertTrue($leave->approvals()->where('role', 'hr')->exists());
    }

    public function test_non_pegawai_leave_has_direktur_approval(): void
    {
        $headUser = User::factory()->create();
        $headUser->assignRole(UserRole::Head->value);

        // Seed required users for CreateLeave action
        User::factory()->create(['email' => 'hr@socio-impact.test'])->assignRole(UserRole::HR->value);
        User::factory()->create(['email' => 'direktur@socio-impact.test'])->assignRole(UserRole::Direktur->value);

        $createLeave = resolve(CreateLeave::class);
        $leave = $createLeave->handle([
            'type' => 'annual',
            'start_date' => now()->addDay()->toDateString(),
            'end_date' => now()->addDays(2)->toDateString(),
        ], $headUser->id);

        $this->assertTrue($leave->approvals()->where('role', 'direktur')->exists());
    }

    public function test_hr_cannot_approve_before_direktur_for_non_pegawai(): void
    {
        $headUser = User::factory()->create();
        $headUser->assignRole(UserRole::Head->value);

        $hr = User::factory()->create(['email' => 'hr@socio-impact.test']);
        $hr->assignRole(UserRole::HR->value);
        $hr->givePermissionTo('approve_leaves');

        $direktur = User::factory()->create(['email' => 'direktur@socio-impact.test']);
        $direktur->assignRole(UserRole::Direktur->value);
        $direktur->givePermissionTo('approve_leaves');

        $createLeave = resolve(CreateLeave::class);
        $leave = $createLeave->handle([
            'type' => 'annual',
            'start_date' => now()->addDay()->toDateString(),
            'end_date' => now()->addDays(2)->toDateString(),
        ], $headUser->id);

        // HR tries to approve
        $response = $this->actingAs($hr)->postJson("/api/v1/leaves/{$leave->code}/status", [
            'action' => 'approve',
        ]);

        $response->assertStatus(403);
        $response->assertJsonPath('message', 'Persetujuan Direktur diperlukan sebelum HR dapat memberikan persetujuan.');
    }

    public function test_hr_can_approve_after_direktur_for_non_pegawai(): void
    {
        $headUser = User::factory()->create();
        $headUser->assignRole(UserRole::Head->value);

        $hr = User::factory()->create(['email' => 'hr@socio-impact.test']);
        $hr->assignRole(UserRole::HR->value);
        $hr->givePermissionTo('approve_leaves');

        $direktur = User::factory()->create(['email' => 'direktur@socio-impact.test']);
        $direktur->assignRole(UserRole::Direktur->value);
        $direktur->givePermissionTo('approve_leaves');

        $createLeave = resolve(CreateLeave::class);
        $leave = $createLeave->handle([
            'type' => 'annual',
            'start_date' => now()->addDay()->toDateString(),
            'end_date' => now()->addDays(2)->toDateString(),
        ], $headUser->id);

        // Direktur approves
        $this->actingAs($direktur)->postJson("/api/v1/leaves/{$leave->code}/status", [
            'action' => 'approve',
        ])->assertStatus(200);

        // HR approves
        $this->actingAs($hr)->postJson("/api/v1/leaves/{$leave->code}/status", [
            'action' => 'approve',
        ])->assertStatus(200);

        $this->assertEquals(LeaveStatus::HRApproved, $leave->fresh()->status);
    }

    public function test_user_with_head_and_hr_roles_can_approve_both_sequentially(): void
    {
        // This user is the HR of the company AND the Head of the submitter
        $multiRoleUser = User::factory()->create(['email' => 'hr@socio-impact.test']);
        $multiRoleUser->assignRole(UserRole::Head->value, UserRole::HR->value);
        $multiRoleUser->givePermissionTo(['approve_leaves', 'reject_leaves']);

        // Since it's a pegawai submission, we don't need a direktur approval
        User::factory()->create(['email' => 'direktur@socio-impact.test'])->assignRole(UserRole::Direktur->value);

        $pegawai = User::factory()->create();
        $pegawai->assignRole(UserRole::Pegawai->value);

        $createLeave = app(CreateLeave::class);
        $leave = $createLeave->handle([
            'type' => 'annual',
            'start_date' => now()->addDay()->toDateString(),
            'end_date' => now()->addDays(2)->toDateString(),
            'approver_head_id' => $multiRoleUser->id,
        ], $pegawai->id);

        // 1. Approve as Head
        $this->actingAs($multiRoleUser)->postJson("/api/v1/leaves/{$leave->code}/status", [
            'action' => 'approve',
        ])->assertStatus(200);

        $this->assertEquals(LeaveStatus::HeadApproved, $leave->fresh()->status);
        $this->assertEquals(ApprovalStatus::Approved, $leave->approvals()->where('role', 'head')->first()->status);
        $this->assertEquals(ApprovalStatus::Pending, $leave->approvals()->where('role', 'hr')->first()->status);

        // 2. Approve as HR (same user)
        $this->actingAs($multiRoleUser)->postJson("/api/v1/leaves/{$leave->code}/status", [
            'action' => 'approve',
        ])->assertStatus(200);

        $this->assertEquals(LeaveStatus::HRApproved, $leave->fresh()->status);
        $this->assertEquals(ApprovalStatus::Approved, $leave->approvals()->where('role', 'hr')->first()->status);
    }
}
