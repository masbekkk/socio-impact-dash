<?php

declare(strict_types=1);

dataset('protected_routes', [
    'dashboard' => '/dashboard',
    'projects' => '/projects',
    'reimbursements' => '/reimbursements',
    'leaves' => '/leaves',
    'presences' => '/presences',
    'admin users' => '/admin/users',
    'admin divisions' => '/admin/divisions',
    'profile' => '/settings/profile',
]);

it('redirects guest to login for protected routes', function (string $route): void {
    $response = $this->get($route);

    $response->assertRedirectToRoute('login');
})->with('protected_routes');

it('allows guest access to welcome page', function (): void {
    $response = $this->get('/');

    $response->assertSuccessful();
    $response->assertSee('Laravel');
});
