<?php

declare(strict_types=1);

use App\Enums\UserRole;
use App\Models\Project;
use App\Models\ProjectEvent;
use App\Models\User;
use Database\Seeders\DivisionSeeder;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(RoleAndPermissionSeeder::class);
    $this->seed(DivisionSeeder::class);

    // Correct way to find/create users with roles using Spatie
    $this->superadmin = User::factory()->withRole(UserRole::Superadmin)->create();
    $this->pegawai = User::factory()->withRole(UserRole::Pegawai)->create();
});

it('renders calendar index view', function (): void {
    actingAs($this->pegawai)
        ->get(route('calendar.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Calendar/Index'));
});

it('fetches only own projects for pegawai', function (): void {
    $ownProject = Project::factory()->create(['created_by' => $this->pegawai->id, 'start_date' => now(), 'end_date' => now()->addDays(2)]);
    $otherProject = Project::factory()->create([
        'created_by' => $this->superadmin->id,
        'pic_id' => $this->superadmin->id,
        'account_manager_id' => $this->superadmin->id,
        'start_date' => now(), 
        'end_date' => now()->addDays(2)
    ]);

    actingAs($this->pegawai)
        ->get(route('calendar.index'))
        ->assertInertia(fn ($page) => $page
            ->has('events', 1)
            ->where('events.0.id', 'project_' . $ownProject->id)
        );
});

it('allows creating calendar event', function (): void {
    actingAs($this->pegawai)
        ->post(route('calendar.store'), [
            'name' => 'General Test Event',
            'start_date' => now()->format('Y-m-d'),
            'end_date' => null,
            'notes' => 'Testing general event',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('project_events', [
        'name' => 'General Test Event',
        'created_by' => $this->pegawai->id,
        'project_id' => null,
    ]);
});

it('allows creating calendar project event', function (): void {
    $ownProject = Project::factory()->create(['created_by' => $this->pegawai->id]);

    actingAs($this->pegawai)
        ->post(route('calendar.store'), [
            'name' => 'Project Linked Event',
            'start_date' => now()->format('Y-m-d'),
            'project_id' => $ownProject->id,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('project_events', [
        'name' => 'Project Linked Event',
        'created_by' => $this->pegawai->id,
        'project_id' => $ownProject->id,
    ]);
});
