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
            'create_projects',
            'view_projects',
            'update_projects',
            'delete_projects',
            'finish_projects',
            'create_reimbursements',
            'view_reimbursements',
            'approve_reimbursements',
            'reject_reimbursements',
            'transfer_reimbursements',
            'create_leaves',
            'view_leaves',
            'approve_leaves',
            'reject_leaves',
            'manage_users',
            'manage_divisions',
            'create_code_project',
            'view_audit_logs',
            'input_budget_partition',
            'approval_budget_partition',
            'manage_detail_budget',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $pegawaiRole = Role::firstOrCreate(['name' => UserRole::Pegawai->value]);
        $pegawaiRole->syncPermissions([
            'create_projects',
            'view_projects',
            'create_reimbursements',
            'view_reimbursements',
            'create_leaves',
            'view_leaves',
        ]);

        $headRole = Role::firstOrCreate(['name' => UserRole::Head->value]);
        $headRole->syncPermissions([
            'create_projects',
            'view_projects',
            'update_projects',
            'approve_reimbursements',
            'approve_leaves',
            'view_reimbursements',
            'view_leaves',
            'manage_detail_budget',
        ]);

        $financeRole = Role::firstOrCreate(['name' => UserRole::Finance->value]);
        $financeRole->syncPermissions([
            'view_reimbursements',
            'approve_reimbursements',
            'transfer_reimbursements',
            'view_projects',
            'view_leaves',
            'create_code_project',
            'view_audit_logs',
            'input_budget_partition',
            'manage_detail_budget',
        ]);

        $superadminRole = Role::firstOrCreate(['name' => UserRole::Superadmin->value]);
        $superadminRole->syncPermissions($permissions);

        $hrRole = Role::firstOrCreate(['name' => UserRole::HR->value]);
        $hrRole->syncPermissions([
            'view_leaves',
            'approve_leaves',
            'view_reimbursements',
            'view_projects',
        ]);

        $direkturRole = Role::firstOrCreate(['name' => UserRole::Direktur->value]);
        $direkturRole->syncPermissions([
            'view_projects',
            'view_reimbursements',
            'approve_reimbursements',
            'view_leaves',
            'approve_leaves',
            'approval_budget_partition',
        ]);
    }
}
