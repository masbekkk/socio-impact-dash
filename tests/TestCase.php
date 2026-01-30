<?php

declare(strict_types=1);

namespace Tests;

use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles and permissions for every test
        $this->seed(RoleAndPermissionSeeder::class);
    }
}

