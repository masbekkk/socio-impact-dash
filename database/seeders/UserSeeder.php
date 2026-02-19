<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

final class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@socio-impact.test'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole(UserRole::Superadmin->value);

        // Create head user
        $head = User::firstOrCreate(
            ['email' => 'head@socio-impact.test'],
            [
                'name' => 'Department Head',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $head->assignRole(UserRole::Head->value);

        // Create finance user
        $finance = User::firstOrCreate(
            ['email' => 'finance@socio-impact.test'],
            [
                'name' => 'Finance Officer',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $finance->assignRole(UserRole::Finance->value);

        // Create HR user
        $hr = User::firstOrCreate(
            ['email' => 'hr@socio-impact.test'],
            [
                'name' => 'HR Manager',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $hr->assignRole(UserRole::HR->value);

        // Create 10 regular employees
        for ($i = 1; $i <= 10; $i++) {
            $user = User::firstOrCreate(
                ['email' => "pegawai{$i}@socio-impact.test"],
                [
                    'name' => "Pegawai {$i}",
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $user->assignRole(UserRole::Pegawai->value);
        }

        $direktur = User::firstOrCreate(
            ['email' => 'direktur@socio-impact.test'],
            [
                'name' => 'Direktur User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $direktur->assignRole(UserRole::Direktur->value);
    }
}
