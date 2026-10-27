<?php

declare(strict_types=1);

namespace Tests;

use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use RuntimeException;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    /**
     * @return array<class-string, int>
     */
    protected function setUpTraits(): array
    {
        $sqlite = config('database.connections.sqlite');

        if (
            $this->app->configurationIsCached()
            || config('database.default') !== 'sqlite'
            || ! is_array($sqlite)
            || ($sqlite['driver'] ?? null) !== 'sqlite'
            || ($sqlite['database'] ?? null) !== ':memory:'
            || ! empty($sqlite['url'])
        ) {
            throw new RuntimeException('Tests require uncached database configuration with in-memory SQLite.');
        }

        config()->set('database.connections', ['sqlite' => $sqlite]);

        /** @var array<class-string, int> $traits */
        $traits = parent::setUpTraits();

        return $traits;
    }

    /** @return void */
    protected function afterRefreshingDatabase()
    {
        $this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
        $this->seed(RoleAndPermissionSeeder::class);
    }
}
