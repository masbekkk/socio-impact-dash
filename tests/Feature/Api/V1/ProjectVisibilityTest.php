<?php

declare(strict_types=1);

namespace Tests\Feature\Api\V1;

use App\Enums\UserRole;
use App\Models\Project;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class ProjectVisibilityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleAndPermissionSeeder::class);
        \App\Models\Division::factory()->create();
        
        // Create at least one user for each role used in ProjectFactory
        User::factory()->create()->assignRole(UserRole::Pegawai->value);
        User::factory()->create()->assignRole(UserRole::Head->value);
    }

    public function test_head_can_only_see_their_own_projects(): void
    {
        $head = User::factory()->create();
        $head->assignRole(UserRole::Head->value);
        
        $otherUser = User::factory()->create();
        $otherUser->assignRole(UserRole::Pegawai->value);

        Project::factory()->create(['created_by' => $head->id, 'name' => 'Head Project']);
        Project::factory()->create(['created_by' => $otherUser->id, 'name' => 'Other Project']);

        $response = $this->actingAs($head)->getJson('/api/v1/projects');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data.data')
            ->assertJsonPath('data.data.0.name', 'Head Project');
    }

    public function test_pegawai_can_only_see_their_own_projects(): void
    {
        $pegawai = User::factory()->create();
        $pegawai->assignRole(UserRole::Pegawai->value);
        
        $otherUser = User::factory()->create();
        $otherUser->assignRole(UserRole::Head->value);

        Project::factory()->create(['created_by' => $pegawai->id, 'name' => 'Pegawai Project']);
        Project::factory()->create(['created_by' => $otherUser->id, 'name' => 'Other Project']);

        $response = $this->actingAs($pegawai)->getJson('/api/v1/projects');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data.data')
            ->assertJsonPath('data.data.0.name', 'Pegawai Project');
    }

    public function test_direktur_can_see_all_projects(): void
    {
        $direktur = User::factory()->create();
        $direktur->assignRole(UserRole::Direktur->value);
        
        $user1 = User::factory()->create();

        Project::factory()->create(['created_by' => $user1->id, 'name' => 'P1']);

        $response = $this->actingAs($direktur)->getJson('/api/v1/projects');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data.data');
    }

    public function test_finance_can_see_all_projects(): void
    {
        $finance = User::factory()->create();
        $finance->assignRole(UserRole::Finance->value);
        
        $user1 = User::factory()->create();

        Project::factory()->create(['created_by' => $user1->id, 'name' => 'P1']);

        $response = $this->actingAs($finance)->getJson('/api/v1/projects');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data.data');
    }

    public function test_superadmin_can_see_all_projects(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole(UserRole::Superadmin->value);
        
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        Project::factory()->create(['created_by' => $user1->id, 'name' => 'P1']);
        Project::factory()->create(['created_by' => $user2->id, 'name' => 'P2']);

        $response = $this->actingAs($admin)->getJson('/api/v1/projects');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data.data');
    }
}
