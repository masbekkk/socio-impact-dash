<?php

declare(strict_types=1);

use App\Enums\UserRole;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Session;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('superadmin can impersonate a user', function (): void {
    $superadmin = User::factory()->create();
    $superadmin->assignRole(UserRole::Superadmin->value);

    $user = User::factory()->create();
    $user->assignRole(UserRole::Pegawai->value);

    $this->actingAs($superadmin)
        ->post(route('admin.users.impersonate', $user))
        ->assertRedirect(route('dashboard'));

    $this->assertEquals($user->id, auth()->id());
    $this->assertEquals($superadmin->id, Session::get('impersonated_by'));
});

test('non-superadmin cannot impersonate a user', function (): void {
    $pegawai1 = User::factory()->create();
    $pegawai1->assignRole(UserRole::Pegawai->value);

    $pegawai2 = User::factory()->create();
    $pegawai2->assignRole(UserRole::Pegawai->value);

    $this->actingAs($pegawai1)
        ->post(route('admin.users.impersonate', $pegawai2))
        ->assertForbidden();

    $this->assertEquals($pegawai1->id, auth()->id());
});

test('admin can stop impersonating', function (): void {
    $superadmin = User::factory()->create();
    $superadmin->assignRole(UserRole::Superadmin->value);

    $user = User::factory()->create();
    $user->assignRole(UserRole::Pegawai->value);

    // Start impersonating
    $this->actingAs($superadmin)
        ->post(route('admin.users.impersonate', $user));

    $this->assertEquals($user->id, auth()->id());

    // Stop impersonating
    $this->post(route('admin.stop-impersonating'))
        ->assertRedirect(route('users.index'));

    $this->assertEquals($superadmin->id, auth()->id());
    $this->assertFalse(Session::has('impersonated_by'));
});

test('session persists across requests after impersonating', function (): void {
    $superadmin = User::factory()->create();
    $superadmin->assignRole(UserRole::Superadmin->value);

    $user = User::factory()->create();
    $user->assignRole(UserRole::Pegawai->value);

    // impersonate user
    $this->actingAs($superadmin)
        ->post(route('admin.users.impersonate', $user))
        ->assertRedirect(route('dashboard'));

    $this->assertEquals($user->id, auth()->id());

    // navigate to another page
    $this->get(route('dashboard'))
        ->assertOk();

    $this->assertEquals($user->id, auth()->id());
});
