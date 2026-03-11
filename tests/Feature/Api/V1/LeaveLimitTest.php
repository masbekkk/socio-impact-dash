<?php

declare(strict_types=1);

namespace Tests\Feature\Api\V1;

use App\Enums\LeaveStatus;
use App\Enums\LeaveType;
use App\Enums\UserRole;
use App\Models\Leave;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class LeaveLimitTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleAndPermissionSeeder::class);
    }

    public function test_user_cannot_request_more_than_12_days_of_annual_leave_in_a_year(): void
    {
        $user = User::factory()->create();
        $user->assignRole(UserRole::Pegawai->value);

        // Requested 13 days
        $response = $this->actingAs($user)->postJson('/api/v1/leaves', [
            'type' => LeaveType::Annual->value,
            'start_date' => '2026-03-01', // 13 working days (Mar 1-17, 2026 has 4 weekends: 1, 7, 8, 14, 15) -> 17-5 = 12? Wait.
            // Mar 1 (Sun), 2-6 (M-F), 7-8 (S-S), 9-13 (M-F), 14-15 (S-S), 16-17 (M-T)
            // Working days: 2,3,4,5,6 (5) + 9,10,11,12,13 (5) + 16,17 (2) = 12 days.
            // Let's use 2026-03-01 to 2026-03-18 for 13 working days.
            'end_date' => '2026-03-18', // 13 working days
            'reason' => 'Too long',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type']);
    }

    public function test_user_can_request_annual_leave_within_limit(): void
    {
        $user = User::factory()->create();
        $user->assignRole(UserRole::Pegawai->value);

        $response = $this->actingAs($user)->postJson('/api/v1/leaves', [
            'type' => LeaveType::Annual->value,
            'start_date' => '2026-03-02', // Monday
            'end_date' => '2026-03-06', // Friday
            'reason' => '5 days',
        ]);

        $response->assertStatus(201);
    }

    public function test_cumulative_annual_leave_cannot_exceed_12_days(): void
    {
        $user = User::factory()->create();
        $user->assignRole(UserRole::Pegawai->value);

        // First request: 10 days
        // Mar 2-13, 2026 (10 working days)
        $this->actingAs($user)->postJson('/api/v1/leaves', [
            'type' => LeaveType::Annual->value,
            'start_date' => '2026-03-02',
            'end_date' => '2026-03-13',
            'reason' => '10 days',
        ])->assertStatus(201);

        // Second request: 3 days (Total 13) -> Should fail
        // Mar 16-18, 2026 (3 working days)
        $response = $this->actingAs($user)->postJson('/api/v1/leaves', [
            'type' => LeaveType::Annual->value,
            'start_date' => '2026-03-16',
            'end_date' => '2026-03-18',
            'reason' => '3 more days',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type']);

        // Third request: 2 days (Total 12) -> Should pass
        // Mar 16-17, 2026 (2 working days)
        $this->actingAs($user)->postJson('/api/v1/leaves', [
            'type' => LeaveType::Annual->value,
            'start_date' => '2026-03-16',
            'end_date' => '2026-03-17',
            'reason' => '2 more days',
        ])->assertStatus(201);
    }

    public function test_rejected_leaves_not_counted_in_limit(): void
    {
        $user = User::factory()->create();
        $user->assignRole(UserRole::Pegawai->value);

        // Create a rejected leave of 10 days
        Leave::query()->create([
            'code' => 'LV-REJECTED',
            'user_id' => $user->id,
            'type' => LeaveType::Annual,
            'status' => LeaveStatus::Rejected,
            'start_date' => '2026-03-02',
            'end_date' => '2026-03-13',
            'reason' => 'Rejected',
        ]);

        // Request 12 days -> Should pass because previous was rejected
        $response = $this->actingAs($user)->postJson('/api/v1/leaves', [
            'type' => LeaveType::Annual->value,
            'start_date' => '2026-04-06',
            'end_date' => '2026-04-21', // 12 working days
            'reason' => '12 days',
        ]);

        $response->assertStatus(201);
    }

    public function test_limit_is_per_year(): void
    {
        $user = User::factory()->create();
        $user->assignRole(UserRole::Pegawai->value);

        // Leave in 2025: 12 days
        Leave::query()->create([
            'code' => 'LV-2025',
            'user_id' => $user->id,
            'type' => LeaveType::Annual,
            'status' => LeaveStatus::Submitted,
            'start_date' => '2025-12-01',
            'end_date' => '2025-12-16', // 12 working days
            'reason' => 'Last year',
        ]);

        // Leave in 2026: 12 days -> Should pass
        $response = $this->actingAs($user)->postJson('/api/v1/leaves', [
            'type' => LeaveType::Annual->value,
            'start_date' => '2026-03-02',
            'end_date' => '2026-03-17', // 12 working days
            'reason' => 'This year',
        ]);

        $response->assertStatus(201);
    }
}
