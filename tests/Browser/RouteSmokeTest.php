<?php

declare(strict_types=1);

use App\Enums\UserRole;
use App\Models\User;

dataset('routes', [
    'dashboard' => '/dashboard',
    'projects index' => '/projects',
    'projects create' => '/projects/create',
    'reimbursements index' => '/reimbursements',
    'reimbursements create' => '/reimbursements/create',
    'leaves index' => '/leaves',
    'leaves create' => '/leaves/create',
    'presences index' => '/presences',
    'profile edit' => '/settings/profile',
]);

dataset('admin_routes', [
    'admin users' => '/admin/users',
    'admin divisions' => '/admin/divisions',
]);

it('loads main routes successfully for pegawai role', function (string $route): void {
    $user = User::factory()->withRole(UserRole::Pegawai)->create();

    $response = $this->actingAs($user)->get($route);

    $response->assertSuccessful();
})->with('routes');

it('loads main routes successfully for head role', function (string $route): void {
    $user = User::factory()->withRole(UserRole::Head)->create();

    $response = $this->actingAs($user)->get($route);

    $response->assertSuccessful();
})->with('routes');

it('loads main routes successfully for finance role', function (string $route): void {
    $user = User::factory()->withRole(UserRole::Finance)->create();

    $response = $this->actingAs($user)->get($route);

    $response->assertSuccessful();
})->with('routes');

it('loads admin routes only for superadmin', function (string $route): void {
    $user = User::factory()->withRole(UserRole::Superadmin)->create();

    $response = $this->actingAs($user)->get($route);

    $response->assertSuccessful();
})->with('admin_routes');

it('denies non-superadmin access to admin routes', function (): void {
    $user = User::factory()->withRole(UserRole::Pegawai)->create();

    $response = $this->actingAs($user)->get('/admin/users');

    $response->assertForbidden();
});

it('has successful response on dashboard for all roles', function (string $role): void {
    $roleEnum = UserRole::from($role);
    $user = User::factory()->withRole($roleEnum)->create();

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertSuccessful();
})->with(['pegawai', 'head', 'finance', 'superadmin']);

it('redirects to login for protected routes when guest', function (): void {
    $response = $this->get('/dashboard');

    $response->assertRedirectToRoute('login');
});
