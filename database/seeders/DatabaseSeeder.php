<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleAndPermissionSeeder::class,
            CompanyUserSeeder::class,
            DivisionSeeder::class,
            LeaveSeeder::class,
            LetterCodeSeeder::class,
            LetterDivisionSeeder::class,
        ]);
    }
}
