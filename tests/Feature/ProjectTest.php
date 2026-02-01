<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\ProjectStatus;
use App\Enums\ProjectType;
use App\Enums\UserRole;
use App\Models\Division;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class ProjectTest extends TestCase
{
    use RefreshDatabase;
    public function test_pegawai_can_create_project(): void
    {
        $user = User::factory()->create(['role' => UserRole::Pegawai]);
        $division = Division::factory()->create();

        $response = $this->actingAs($user)->post(route('projects.store'), [
            'code' => 'TEST-001',
            'name' => 'Test Project',
            'client' => 'Test Client',
            'division_id' => $division->id,
            'project_type' => ProjectType::Pendampingan->value,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('projects', ['name' => 'Test Project']);
    }

    public function test_finance_cannot_create_project(): void
    {
        $user = User::factory()->create(['role' => UserRole::Finance]);
        $division = Division::factory()->create();

        $response = $this->actingAs($user)->post(route('projects.store'), [
            'code' => 'TEST-002',
            'name' => 'Test Project',
            'client' => 'Test Client',
            'division_id' => $division->id,
            'project_type' => ProjectType::Pendampingan->value,
        ]);

        $response->assertForbidden();
    }

    public function test_head_can_finish_project(): void
    {
        $head = User::factory()->create(['role' => UserRole::Head]);
        $project = Project::factory()->create(['head_id' => $head->id]);

        $response = $this->actingAs($head)->post(route('projects.finish', $project));

        $response->assertRedirect();
        $this->assertEquals(ProjectStatus::Finished->value, $project->fresh()->status->value);
    }
}
