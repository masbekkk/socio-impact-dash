# 🔐 SocioImpact ERP - Spatie Permission Integration Guide

**Last Updated**: January 30, 2026  
**Status**: ✅ All scaffolding complete - Ready for code injection

---

## 📋 Table of Contents

1. [Role & Permission Configuration](#role--permission-configuration)
2. [Seeder Implementation](#seeder-implementation)
3. [Policy Implementation](#policy-implementation)
4. [Controller Implementation](#controller-implementation)
5. [Form Request Validation](#form-request-validation)
6. [AuthServiceProvider Setup](#authserviceprovider-setup)
7. [Frontend Integration](#frontend-integration)

---

## 🔐 Role & Permission Configuration

### Roles Defined
- **pegawai**: Regular employee (view own projects, submit requests)
- **head**: Department head (approve subordinates' requests, manage division)
- **finance**: Finance officer (approve reimbursements, manage transfers)
- **superadmin**: System administrator (full access)

### Permissions Defined

**Project Permissions**:
- `create projects`
- `view projects`
- `update projects`
- `delete projects`
- `finish projects`

**Reimbursement Permissions**:
- `create reimbursements`
- `view reimbursements`
- `approve reimbursements`
- `reject reimbursements`
- `transfer reimbursements`

**Leave Permissions**:
- `create leaves`
- `view leaves`
- `approve leaves`
- `reject leaves`

**System Permissions**:
- `manage users`
- `manage divisions`
- `view audit logs`

---

## 🌱 Seeder Implementation

### Copy this code into `database/seeders/RoleAndPermissionSeeder.php`

```php
<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

final class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()['cache']->forget('spatie.permission.cache');

        // Create permissions
        $projectPermissions = [
            'create projects',
            'view projects',
            'update projects',
            'delete projects',
            'finish projects',
        ];

        $reimbursementPermissions = [
            'create reimbursements',
            'view reimbursements',
            'approve reimbursements',
            'reject reimbursements',
            'transfer reimbursements',
        ];

        $leavePermissions = [
            'create leaves',
            'view leaves',
            'approve leaves',
            'reject leaves',
        ];

        $systemPermissions = [
            'manage users',
            'manage divisions',
            'view audit logs',
        ];

        $allPermissions = array_merge(
            $projectPermissions,
            $reimbursementPermissions,
            $leavePermissions,
            $systemPermissions,
        );

        foreach ($allPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $pegawaiRole = Role::firstOrCreate(['name' => 'pegawai']);
        $headRole = Role::firstOrCreate(['name' => 'head']);
        $financeRole = Role::firstOrCreate(['name' => 'finance']);
        $superadminRole = Role::firstOrCreate(['name' => 'superadmin']);

        // Assign permissions to pegawai
        $pegawaiRole->syncPermissions([
            'create projects',
            'view projects',
            'create reimbursements',
            'view reimbursements',
            'create leaves',
            'view leaves',
        ]);

        // Assign permissions to head
        $headRole->syncPermissions([
            'view projects',
            'update projects',
            'view reimbursements',
            'approve reimbursements',
            'view leaves',
            'approve leaves',
        ]);

        // Assign permissions to finance
        $financeRole->syncPermissions([
            'view projects',
            'view reimbursements',
            'approve reimbursements',
            'reject reimbursements',
            'transfer reimbursements',
        ]);

        // Assign all permissions to superadmin
        $superadminRole->syncPermissions($allPermissions);
    }
}
```

### Copy this code into `database/seeders/UserSeeder.php`

```php
<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\EmployeeType;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

final class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@socio-impact.test'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => UserRole::Superadmin,
                'employee_type' => EmployeeType::PegawaiTetap,
                'contract_start' => now()->subYears(5),
                'contract_end' => now()->addYears(5),
            ],
        );
        $admin->assignRole('superadmin');

        // Head user
        $head = User::firstOrCreate(
            ['email' => 'head@socio-impact.test'],
            [
                'name' => 'Kepala Divisi',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => UserRole::Head,
                'employee_type' => EmployeeType::PegawaiTetap,
                'contract_start' => now()->subYears(3),
                'contract_end' => now()->addYears(3),
            ],
        );
        $head->assignRole('head');

        // Finance user
        $finance = User::firstOrCreate(
            ['email' => 'finance@socio-impact.test'],
            [
                'name' => 'Bagian Keuangan',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => UserRole::Finance,
                'employee_type' => EmployeeType::PegawaiTetap,
                'contract_start' => now()->subYears(2),
                'contract_end' => now()->addYears(3),
            ],
        );
        $finance->assignRole('finance');

        // Regular users
        User::factory(10)
            ->has(
                \Database\Factories\ProjectFactory::new(),
            )
            ->create()
            ->each(function (User $user) {
                $user->assignRole('pegawai');
            });
    }
}
```

### Copy this code into `database/seeders/DivisionSeeder.php`

```php
<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Division;
use Illuminate\Database\Seeder;

final class DivisionSeeder extends Seeder
{
    public function run(): void
    {
        Division::firstOrCreate([
            'code' => 'DIV-001',
            'name' => 'Divisi Teknologi Informasi',
            'description' => 'Tim pengembangan sistem dan infrastruktur IT',
        ]);

        Division::firstOrCreate([
            'code' => 'DIV-002',
            'name' => 'Divisi Operasional',
            'description' => 'Tim operasional dan administrasi',
        ]);

        Division::firstOrCreate([
            'code' => 'DIV-003',
            'name' => 'Divisi Keuangan',
            'description' => 'Tim keuangan dan akuntansi',
        ]);

        Division::firstOrCreate([
            'code' => 'DIV-004',
            'name' => 'Divisi Sumber Daya Manusia',
            'description' => 'Tim SDM dan pengembangan karyawan',
        ]);
    }
}
```

---

## 🛡️ Policy Implementation

### Copy this code into `app/Policies/ProjectPolicy.php`

```php
<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Project;
use App\Models\User;

final class ProjectPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view projects');
    }

    public function view(User $user, Project $project): bool
    {
        return $user->hasPermissionTo('view projects')
            && ($user->id === $project->user_id || $user->role === UserRole::Superadmin);
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create projects');
    }

    public function update(User $user, Project $project): bool
    {
        return $user->hasPermissionTo('update projects')
            && ($user->id === $project->user_id || $user->role === UserRole::Head || $user->role === UserRole::Superadmin);
    }

    public function delete(User $user, Project $project): bool
    {
        return $user->hasPermissionTo('delete projects')
            && ($user->id === $project->user_id || $user->role === UserRole::Superadmin);
    }

    public function restore(User $user, Project $project): bool
    {
        return $user->hasPermissionTo('delete projects');
    }

    public function forceDelete(User $user, Project $project): bool
    {
        return $user->role === UserRole::Superadmin;
    }

    public function finish(User $user, Project $project): bool
    {
        return $user->hasPermissionTo('finish projects')
            && ($user->id === $project->head_id || $user->role === UserRole::Superadmin);
    }
}
```

### Copy this code into `app/Policies/ReimbursementPolicy.php`

```php
<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Reimbursement;
use App\Models\User;

final class ReimbursementPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view reimbursements');
    }

    public function view(User $user, Reimbursement $reimbursement): bool
    {
        return $user->hasPermissionTo('view reimbursements')
            && ($user->id === $reimbursement->user_id || $user->role !== UserRole::Pegawai);
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create reimbursements');
    }

    public function update(User $user, Reimbursement $reimbursement): bool
    {
        return $user->hasPermissionTo('view reimbursements')
            && $user->id === $reimbursement->user_id;
    }

    public function delete(User $user, Reimbursement $reimbursement): bool
    {
        return $user->hasPermissionTo('approve reimbursements')
            && $user->role === UserRole::Superadmin;
    }

    public function approve(User $user, Reimbursement $reimbursement): bool
    {
        return $user->hasPermissionTo('approve reimbursements')
            && $user->role !== UserRole::Pegawai;
    }

    public function reject(User $user, Reimbursement $reimbursement): bool
    {
        return $user->hasPermissionTo('reject reimbursements');
    }

    public function transfer(User $user, Reimbursement $reimbursement): bool
    {
        return $user->hasPermissionTo('transfer reimbursements')
            && $user->role === UserRole::Finance;
    }
}
```

### Copy this code into `app/Policies/LeavePolicy.php`

```php
<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Leave;
use App\Models\User;

final class LeavePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view leaves');
    }

    public function view(User $user, Leave $leave): bool
    {
        return $user->hasPermissionTo('view leaves')
            && ($user->id === $leave->user_id || $user->role !== UserRole::Pegawai);
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create leaves');
    }

    public function update(User $user, Leave $leave): bool
    {
        return $user->hasPermissionTo('view leaves')
            && $user->id === $leave->user_id;
    }

    public function delete(User $user, Leave $leave): bool
    {
        return $user->role === UserRole::Superadmin;
    }

    public function approve(User $user, Leave $leave): bool
    {
        return $user->hasPermissionTo('approve leaves');
    }

    public function reject(User $user, Leave $leave): bool
    {
        return $user->hasPermissionTo('reject leaves');
    }
}
```

---

## 🎮 Controller Implementation

### ProjectController Scaffold
Copy this into `app/Http/Controllers/ProjectController.php`:

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CreateProject;
use App\Actions\FinishProject;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Division;
use App\Models\Project;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class ProjectController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $this->authorize('viewAny', Project::class);

        $projects = Project::with('division', 'creator', 'head')
            ->when(!Auth::user()?->hasRole('superadmin'), function ($query) {
                return $query->where('user_id', Auth::id())
                    ->orWhere('head_id', Auth::id());
            })
            ->paginate(15);

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'divisions' => Division::all(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Project::class);

        return Inertia::render('Projects/Create', [
            'divisions' => Division::all(),
            'users' => \App\Models\User::all(),
        ]);
    }

    public function store(StoreProjectRequest $request, CreateProject $action): RedirectResponse
    {
        $project = $action->handle($request->validated());

        return redirect()->route('projects.show', $project)
            ->with('success', 'Proyek berhasil dibuat');
    }

    public function show(Project $project): Response
    {
        $this->authorize('view', $project);

        return Inertia::render('Projects/Show', [
            'project' => $project->load('division', 'creator', 'milestones', 'budgets', 'documents', 'issues'),
        ]);
    }

    public function edit(Project $project): Response
    {
        $this->authorize('update', $project);

        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'divisions' => Division::all(),
            'users' => \App\Models\User::all(),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $project->update($request->validated());

        return redirect()->route('projects.show', $project)
            ->with('success', 'Proyek berhasil diperbarui');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $this->authorize('delete', $project);

        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Proyek berhasil dihapus');
    }

    public function finish(Project $project, FinishProject $action): RedirectResponse
    {
        $this->authorize('finish', $project);

        $action->handle($project);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Proyek berhasil diselesaikan');
    }
}
```

### ReimbursementController Scaffold
Copy this into `app/Http/Controllers/ReimbursementController.php`:

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\ApproveReimbursement;
use App\Actions\CreateReimbursement;
use App\Http\Requests\ApproveReimbursementRequest;
use App\Http\Requests\StoreReimbursementRequest;
use App\Models\Reimbursement;
use App\Models\Project;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class ReimbursementController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $this->authorize('viewAny', Reimbursement::class);

        $reimbursements = Reimbursement::with('user', 'project')
            ->when(!Auth::user()?->hasRole('superadmin'), function ($query) {
                return $query->where('user_id', Auth::id());
            })
            ->paginate(15);

        return Inertia::render('Reimbursements/Index', [
            'reimbursements' => $reimbursements,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Reimbursement::class);

        return Inertia::render('Reimbursements/Create', [
            'projects' => Project::where('user_id', Auth::id())->get(),
        ]);
    }

    public function store(StoreReimbursementRequest $request, CreateReimbursement $action): RedirectResponse
    {
        $reimbursement = $action->handle($request->validated());

        return redirect()->route('reimbursements.show', $reimbursement)
            ->with('success', 'Reimbursement berhasil dibuat');
    }

    public function show(Reimbursement $reimbursement): Response
    {
        $this->authorize('view', $reimbursement);

        return Inertia::render('Reimbursements/Show', [
            'reimbursement' => $reimbursement->load('documents', 'approvals', 'user'),
        ]);
    }

    public function approvals(): Response
    {
        return Inertia::render('Reimbursements/Approvals', [
            'pendingApprovals' => Reimbursement::with('user', 'approvals')
                ->whereHas('approvals', function ($query) {
                    return $query->where('approver_id', Auth::id())
                        ->where('status', 'pending');
                })
                ->paginate(15),
        ]);
    }

    public function approve(Reimbursement $reimbursement, ApproveReimbursementRequest $request, ApproveReimbursement $action): RedirectResponse
    {
        $this->authorize('approve', $reimbursement);

        $action->handle($reimbursement, $request->validated());

        return redirect()->route('reimbursements.show', $reimbursement)
            ->with('success', 'Reimbursement berhasil disetujui');
    }

    public function reject(Reimbursement $reimbursement, ApproveReimbursementRequest $request): RedirectResponse
    {
        $this->authorize('reject', $reimbursement);

        $reimbursement->approvals()
            ->where('approver_id', Auth::id())
            ->update([
                'status' => 'rejected',
                'approved_at' => now(),
            ]);

        return redirect()->route('reimbursements.show', $reimbursement)
            ->with('success', 'Reimbursement berhasil ditolak');
    }
}
```

### LeaveController & PresenceController
Similar patterns apply. Use the same authorization pattern with policies and Spatie permission checks.

---

## 🔍 Form Request Validation

### StoreProjectRequest

```php
<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('create projects');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'client' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'division_id' => ['required', 'exists:divisions,id'],
            'account_manager_id' => ['nullable', 'exists:users,id'],
            'head_id' => ['nullable', 'exists:users,id'],
            'pic_id' => ['nullable', 'exists:users,id'],
            'sow' => ['nullable', 'string'],
            'budget_total' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama proyek harus diisi',
            'client.required' => 'Nama klien harus diisi',
            'division_id.required' => 'Divisi harus dipilih',
        ];
    }
}
```

---

## 🔐 AuthServiceProvider Setup

Add this to `app/Providers/AuthServiceProvider.php`:

```php
<?php

namespace App\Providers;

use App\Models\Leave;
use App\Models\Project;
use App\Models\Reimbursement;
use App\Policies\LeavePolicy;
use App\Policies\ProjectPolicy;
use App\Policies\ReimbursementPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

final class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Project::class => ProjectPolicy::class,
        Reimbursement::class => ReimbursementPolicy::class,
        Leave::class => LeavePolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();

        // Super admin gate bypass
        Gate::define('view-admin', function ($user) {
            return $user->hasRole('superadmin');
        });
    }
}
```

---

## 🎨 Frontend Integration with Spatie

Update `resources/js/components/RoleGate.tsx` to check Spatie permissions:

```tsx
import React from 'react'
import { usePage } from '@inertiajs/react'

interface RoleGateProps {
  roles?: string[]
  permissions?: string[]
  children: React.ReactNode
}

export default function RoleGate({ roles = [], permissions = [], children }: RoleGateProps) {
  const { props } = usePage()
  const auth = (props.auth as any) || {}
  const user = auth?.user

  if (!user) return null

  // Check roles
  if (roles.length > 0) {
    const hasRole = roles.some((role) => user.roles?.includes(role))
    if (!hasRole) return null
  }

  // Check permissions
  if (permissions.length > 0) {
    const hasPermission = permissions.some((perm) => user.permissions?.includes(perm))
    if (!hasPermission) return null
  }

  return <>{children}</>
}
```

---

## ✅ Checklist

- [ ] Copy RoleAndPermissionSeeder code
- [ ] Copy UserSeeder code
- [ ] Copy DivisionSeeder code
- [ ] Copy ProjectPolicy code
- [ ] Copy ReimbursementPolicy code
- [ ] Copy LeavePolicy code
- [ ] Copy ProjectController code
- [ ] Copy ReimbursementController code
- [ ] Update AuthServiceProvider
- [ ] Update AppSidebar.tsx with user.roles checks
- [ ] Run `php artisan db:seed --class=RoleAndPermissionSeeder`
- [ ] Run `php artisan db:seed --class=DivisionSeeder`
- [ ] Test login and check role-based access

---

## 🚀 Testing

```bash
# Test as different roles
curl -X GET http://localhost:8000/api/projects \
  -H "Authorization: Bearer <token>"

# Check user permissions
php artisan tinker
>>> $user = User::first();
>>> $user->hasPermissionTo('create projects');
>>> $user->hasRole('pegawai');
```

