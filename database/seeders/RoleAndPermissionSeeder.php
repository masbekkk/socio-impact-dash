<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

final class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            'create projects',
            'view projects',
            'update projects',
            'delete projects',
            'finish projects',
            'create reimbursements',
            'view reimbursements',
            'approve reimbursements',
            'reject reimbursements',
            'transfer reimbursements',
            'create leaves',
            'view leaves',
            'approve leaves',
            'reject leaves',
            'manage users',
            'manage divisions',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $pegawaiRole = Role::firstOrCreate(['name' => UserRole::Pegawai->value]);
        $pegawaiRole->syncPermissions([
            'create projects',
            'view projects',
            'create reimbursements',
            'view reimbursements',
            'create leaves',
            'view leaves',
        ]);

        $headRole = Role::firstOrCreate(['name' => UserRole::Head->value]);
        $headRole->syncPermissions([
            'create projects',
            'view projects',
            'update projects',
            'approve reimbursements',
            'approve leaves',
            'view reimbursements',
        ]);

        $financeRole = Role::firstOrCreate(['name' => UserRole::Finance->value]);
        $financeRole->syncPermissions([
            'view reimbursements',
            'approve reimbursements',
            'transfer reimbursements',
            'view projects',
            'view leaves',
        ]);

        $superadminRole = Role::firstOrCreate(['name' => UserRole::Superadmin->value]);
        $superadminRole->syncPermissions($permissions);
    }
}
