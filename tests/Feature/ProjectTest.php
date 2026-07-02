<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\ProjectStatus;
use App\Enums\UserRole;
use App\Models\Division;
use App\Models\Project;
use App\Models\User;
use Tests\TestCase;

final class ProjectTest extends TestCase
{
    public function test_pegawai_can_create_project(): void
    {
        $user = User::factory()->withRole(UserRole::Pegawai)->create();
        $division = Division::factory()->create();

        $response = $this->actingAs($user)->postJson(route('api.projects.store'), [
            'code' => 'TEST-001',
            'name' => 'Test Project',
            'client_name' => 'Test Client',
            'division_id' => $division->id,
            'account_manager_id' => $user->id,
            'head_id' => $user->id,
            'pic_id' => $user->id,
            'project_type' => 'consultation',
            'budget_total' => 1000000,
            'start_date' => now()->format('Y-m-d'),
            'end_date' => now()->addDays(5)->format('Y-m-d'),
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('projects', ['name' => 'Test Project', 'client_name' => 'Test Client']);
    }

    public function test_finance_can_create_project(): void
    {
        $user = User::factory()->withRole(UserRole::Finance)->create();
        $division = Division::factory()->create();

        $response = $this->actingAs($user)->postJson(route('api.projects.store'), [
            'code' => 'TEST-002',
            'name' => 'Test Project',
            'client_name' => 'Test Client',
            'division_id' => $division->id,
            'account_manager_id' => $user->id,
            'head_id' => $user->id,
            'pic_id' => $user->id,
            'project_type' => 'consultation',
            'budget_total' => 1000000,
            'start_date' => now()->format('Y-m-d'),
            'end_date' => now()->addDays(5)->format('Y-m-d'),
        ]);

        // Assuming role Finance actually has permission to create project based on DB
        $response->assertCreated();
    }

    public function test_management_budget_can_be_updated(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test-user@example.com',
            'password' => bcrypt('password'),
        ]);
        $project = Project::create([
            'name' => 'Test Project',
            'code' => 'TEST-MGMT-001',
            'created_by' => $user->id,
            'project_type' => 'consultation',
            'management_budget' => 100000,
            'budget_total' => 500000,
            'status' => ProjectStatus::Draft,
        ]);

        $response = $this->actingAs($user)->putJson(route('api.projects.update', $project), [
            'management_budget' => 250000,
        ]);

        $response->assertOk();
        $this->assertSame(250000.0, (float) $project->fresh()->management_budget);
    }

    public function test_head_can_close_project(): void
    {
        $head = User::factory()->withRole(UserRole::Head)->create();
        $project = Project::factory()->create(['head_id' => $head->id]);

        $response = $this->actingAs($head)->postJson("/api/v1/projects/{$project->uuid}/close", [
            'actual_budget' => 500000,
            'documents' => [],
        ]);

        $response->assertOk();
        $this->assertEquals(ProjectStatus::Finished->value, $project->fresh()->status->value);
    }
}
