<?php

declare(strict_types=1);

use App\Enums\UserRole;
use App\Models\User;

it('pegawai can access dashboard and get successful response', function (): void {
    $user = User::factory()->withRole(UserRole::Pegawai)->create();

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertSuccessful();
    $response->assertInertia(fn (): true => true);
});

it('head can access dashboard and get successful response', function (): void {
    $user = User::factory()->withRole(UserRole::Head)->create();

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertSuccessful();
    $response->assertInertia(fn (): true => true);
});

it('finance can access dashboard and get successful response', function (): void {
    $user = User::factory()->withRole(UserRole::Finance)->create();

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertSuccessful();
    $response->assertInertia(fn (): true => true);
});

it('superadmin can access dashboard and get successful response', function (): void {
    $user = User::factory()->withRole(UserRole::Superadmin)->create();

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertSuccessful();
    $response->assertInertia(fn (): true => true);
});

it('sidebar renders for pegawai without errors', function (): void {
    $user = User::factory()->withRole(UserRole::Pegawai)->create();

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertSuccessful();
});

it('sidebar renders for superadmin without errors', function (): void {
    $user = User::factory()->withRole(UserRole::Superadmin)->create();

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertSuccessful();
});
