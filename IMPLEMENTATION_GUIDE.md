# SocioImpact ERP System - Complete Backend & Frontend Implementation Guide

## ✅ COMPLETED SO FAR
- ✔ 14 Enums (UserRole, ProjectStatus, ReimbursementType, etc.)
- ✔ 13 Migrations (divisions, projects, milestones, budgets, documents, issues, reimbursements, leaves, presences, approvals)
- ✔ Extended User model with roles, employee_type, relationships
- ✔ 10 Models (Division, Project, ProjectMilestone, ProjectBudget, ProjectDocument, ProjectIssue, Reimbursement, ReimbursementDocument, ReimbursementApproval, Leave, LeaveApproval, Presence)

---

## 📋 REMAINING FILES TO CREATE (Grouped by Feature)

### A. FACTORIES

All factories should be created via artisan (auto-generated). They need minimal customization in `database/factories/*.php`:

#### DivisionFactory
```php
<?php
declare(strict_types=1);
namespace Database\Factories;
use App\Models\Division;
use Illuminate\Database\Eloquent\Factories\Factory;

final class DivisionFactory extends Factory
{
    protected $model = Division::class;
    
    public function definition(): array
    {
        return [
            'code' => $this->faker->unique()->word(),
            'name' => $this->faker->word(),
            'description' => $this->faker->sentence(),
        ];
    }
}
```

#### ProjectFactory, ProjectMilestoneFactory, ProjectBudgetFactory (similar structure)
- ProjectFactory: code (unique), name, client, division_id, user_id (creator), status=Draft, budget_total
- ProjectMilestoneFactory: project_id, title, target_date (future), status=Planned
- ProjectBudgetFactory: project_id, category, planned_amount, actual_amount=0

#### ReimbursementFactory
- code (unique), user_id, type (ATR/EER), status=Draft, amount, bank info for ATR

#### LeaveFactory
- code (unique), user_id, type, start/end_date, status=Draft

#### PresenceFactory
- user_id, date (today), status=CheckedIn, check_in_at, latitude/longitude, photo_path

### B. SEEDERS

#### database/seeders/DivisionSeeder.php
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
        Division::factory(3)->create();
    }
}
```

#### database/seeders/UserSeeder.php
```php
<?php
declare(strict_types=1);
namespace Database\Seeders;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Database\Seeder;

final class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Superadmin
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'role' => UserRole::Superadmin,
        ]);
        
        // Head
        User::factory()->create([
            'name' => 'Kepala Divisi',
            'email' => 'head@example.com',
            'role' => UserRole::Head,
        ]);
        
        // Finance
        User::factory()->create([
            'name' => 'Keuangan',
            'email' => 'finance@example.com',
            'role' => UserRole::Finance,
        ]);
        
        // Pegawai
        User::factory(5)->create(['role' => UserRole::Pegawai]);
    }
}
```

Then update `database/seeders/DatabaseSeeder.php`:
```php
public function run(): void
{
    $this->call([
        DivisionSeeder::class,
        UserSeeder::class,
    ]);
}
```

### C. FORM REQUESTS

#### app/Http/Requests/StoreProjectRequest.php
```php
<?php
declare(strict_types=1);
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

final class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // check in controller/policy
    }
    
    public function rules(): array
    {
        return [
            'code' => 'required|string|unique:projects',
            'name' => 'required|string|min:3',
            'client' => 'required|string',
            'division_id' => 'required|integer|exists:divisions,id',
            'account_manager_id' => 'nullable|integer|exists:users,id',
            'head_id' => 'nullable|integer|exists:users,id',
            'pic_id' => 'nullable|integer|exists:users,id',
            'sow' => 'nullable|string',
            'budget_total' => 'nullable|numeric|min:0',
        ];
    }
    
    public function messages(): array
    {
        return [
            'code.required' => 'Kode proyek diperlukan',
            'name.required' => 'Nama proyek diperlukan',
        ];
    }
}
```

#### app/Http/Requests/UpdateProjectRequest.php
```php
public function rules(): array
{
    return [
        'code' => 'required|string|unique:projects,code,' . $this->route('project'),
        'name' => 'required|string|min:3',
        'client' => 'required|string',
        'division_id' => 'required|integer|exists:divisions,id',
        'account_manager_id' => 'nullable|integer|exists:users,id',
        'head_id' => 'nullable|integer|exists:users,id',
        'pic_id' => 'nullable|integer|exists:users,id',
        'sow' => 'nullable|string',
        'budget_total' => 'nullable|numeric|min:0',
    ];
}
```

#### app/Http/Requests/StoreReimbursementRequest.php
```php
public function rules(): array
{
    return [
        'type' => 'required|in:atr,eer',
        'project_id' => 'nullable|integer|exists:projects,id',
        'amount' => 'required|numeric|min:1',
        'bank_name' => 'required_if:type,atr|string',
        'bank_account' => 'required_if:type,atr|string',
        'account_holder' => 'required_if:type,atr|string',
    ];
}
```

#### app/Http/Requests/StoreLeaveRequest.php
```php
public function rules(): array
{
    return [
        'type' => 'required|in:annual,sick,unpaid,travel',
        'start_date' => 'required|date|after_or_equal:today',
        'end_date' => 'required|date|after_or_equal:start_date',
        'reason' => 'nullable|string',
        'attachment' => 'nullable|file|mimes:pdf,doc,docx',
    ];
}
```

#### app/Http/Requests/CheckInRequest.php
```php
public function rules(): array
{
    return [
        'latitude' => 'required|numeric',
        'longitude' => 'required|numeric',
        'photo' => 'required|image|mimes:jpeg,png,jpg|max:5120',
        'notes' => 'nullable|string',
    ];
}
```

### D. ACTIONS (Business Logic)

#### app/Actions/CreateProject.php
```php
<?php
declare(strict_types=1);
namespace App\Actions;
use App\Models\Project;
use App\Enums\ProjectStatus;
use Illuminate\Support\Facades\DB;

final readonly class CreateProject
{
    public function handle(array $data): Project
    {
        return DB::transaction(function () use ($data) {
            $project = Project::create([
                ...$data,
                'code' => 'PRJ-' . strtoupper(uniqid()),
                'status' => ProjectStatus::Draft,
            ]);
            
            // Auto-create budget rows if provided
            if (isset($data['budgets'])) {
                foreach ($data['budgets'] as $budget) {
                    $project->budgets()->create($budget);
                }
            }
            
            return $project;
        });
    }
}
```

#### app/Actions/UpdateProject.php, FinishProject.php, CreateReimbursement.php, ApproveReimbursement.php, etc.
(Follow similar pattern: readonly class, constructor injection, handle() method, DB::transaction for multi-model ops)

### E. POLICIES (Authorization)

#### app/Policies/ProjectPolicy.php
```php
<?php
declare(strict_types=1);
namespace App\Policies;
use App\Models\User;
use App\Models\Project;
use App\Enums\UserRole;

final class ProjectPolicy
{
    public function create(User $user): bool
    {
        return $user->role !== UserRole::Finance;
    }
    
    public function update(User $user, Project $project): bool
    {
        return $user->id === $project->user_id ||
               $user->id === $project->head_id ||
               $user->role === UserRole::Superadmin;
    }
    
    public function finish(User $user, Project $project): bool
    {
        return $user->id === $project->head_id || $user->role === UserRole::Superadmin;
    }
}
```

#### app/Policies/ReimbursementPolicy.php
```php
public function approve(User $user, Reimbursement $reimb): bool
{
    return ($user->role === UserRole::Head || $user->role === UserRole::Finance) ||
           $user->role === UserRole::Superadmin;
}
```

### F. CONTROLLERS

#### app/Http/Controllers/ProjectController.php
```php
<?php
declare(strict_types=1);
namespace App\Http\Controllers;
use App\Actions\CreateProject;
use App\Http\Requests\StoreProjectRequest;
use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

final readonly class ProjectController
{
    public function __construct(private CreateProject $createProject) {}
    
    public function index(): Response
    {
        return Inertia::render('Projects/Index', [
            'projects' => Project::with(['creator', 'head', 'pic'])->paginate(),
        ]);
    }
    
    public function create(): Response
    {
        return Inertia::render('Projects/Create');
    }
    
    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $project = $this->createProject->handle($request->validated());
        return redirect()->route('projects.show', $project);
    }
    
    public function show(Project $project): Response
    {
        $project->load(['milestones', 'budgets', 'documents', 'issues']);
        return Inertia::render('Projects/Show', ['project' => $project]);
    }
}
```

Similar pattern for: ReimbursementController, LeaveController, PresenceController, Admin/UserController, Admin/DivisionController

### G. ROUTES (routes/web.php)

Add to authenticated routes:
```php
Route::middleware(['auth', 'verified'])->group(function (): void {
    // Projects
    Route::resource('projects', ProjectController::class);
    Route::post('projects/{project}/finish', [ProjectController::class, 'finish'])->name('projects.finish');
    
    // Reimbursements
    Route::resource('reimbursements', ReimbursementController::class);
    Route::get('reimbursements/approvals', [ReimbursementController::class, 'approvals'])->name('reimbursements.approvals');
    Route::post('reimbursements/{reimbursement}/approve', [ReimbursementController::class, 'approve'])->name('reimbursements.approve');
    Route::post('reimbursements/{reimbursement}/reject', [ReimbursementController::class, 'reject'])->name('reimbursements.reject');
    
    // Leaves
    Route::resource('leaves', LeaveController::class);
    Route::get('leaves/approvals', [LeaveController::class, 'approvals'])->name('leaves.approvals');
    Route::post('leaves/{leave}/approve', [LeaveController::class, 'approve'])->name('leaves.approve');
    
    // Presence
    Route::post('presences/check-in', [PresenceController::class, 'checkIn'])->name('presences.check-in');
    Route::get('presences', [PresenceController::class, 'index'])->name('presences.index');
    
    // Admin
    Route::middleware('admin')->group(function (): void {
        Route::resource('admin/users', Admin\UserController::class);
        Route::resource('admin/divisions', Admin\DivisionController::class);
    });
});
```

### H. INERTIA REACT PAGES (resources/js/Pages/*.tsx)

Already scaffolded in previous work. Extend with:

#### resources/js/Pages/Projects/Index.tsx
- Fetch `projects` prop (paginated)
- Filters: status, division, head
- Table with actions: View, Edit, Finish
- Link to create

#### resources/js/Pages/Projects/Create.tsx
- Multi-tab form (already done)
- useForm helper: handle form submission to projects.store

#### resources/js/Pages/Projects/Show.tsx
- Tabs: Overview, Timeline, Budget, Documents, Issues, Activity
- Edit/Delete buttons (if authorized)
- Mark Finished action

#### resources/js/Pages/Reimbursements/Index.tsx
- Tabs: ATR, EER, My Requests, Approvals (role-gated)

#### resources/js/Pages/Reimbursements/CreateATR.tsx & CreateEER.tsx
- Upload Proposal + RAB (ATR) or EER + Receipts (EER)
- Bank form
- useForm submission

#### resources/js/Pages/Reimbursements/Approvals.tsx
- Table of pending reimbursements (Head/Finance only)
- Detail drawer with ApprovalActions component
- Status badge + audit timeline

#### resources/js/Pages/Leave/Index.tsx
- List of user's leaves with status
- Create buttons

#### resources/js/Pages/Presence/Index.tsx
- Check-in form (already done)
- Geolocation + photo upload required
- Last 7 days table

#### resources/js/Pages/Admin/Users/Index.tsx (superadmin only)
- User list table: name, email, role, employee_type, contract dates
- Actions: Edit, Delete, Reset Password

---

## 🚀 QUICK EXECUTION STEPS

### 1. Generate Factories/Seeders/Actions/Controllers/Policies/Requests
```bash
# Factories (auto-generated, minimal edits needed)
php artisan make:factory DivisionFactory --no-interaction
php artisan make:factory ProjectFactory --no-interaction
php artisan make:factory ProjectMilestoneFactory --no-interaction
php artisan make:factory ProjectBudgetFactory --no-interaction
php artisan make:factory ReimbursementFactory --no-interaction
php artisan make:factory LeaveFactory --no-interaction
php artisan make:factory PresenceFactory --no-interaction

# Seeders
php artisan make:seeder DivisionSeeder --no-interaction
php artisan make:seeder UserSeeder --no-interaction

# Actions
php artisan make:action "CreateProject" --no-interaction
php artisan make:action "UpdateProject" --no-interaction
php artisan make:action "FinishProject" --no-interaction
php artisan make:action "CreateReimbursement" --no-interaction
php artisan make:action "ApproveReimbursement" --no-interaction
php artisan make:action "RejectReimbursement" --no-interaction
php artisan make:action "CreateLeave" --no-interaction
php artisan make:action "ApproveLeave" --no-interaction
php artisan make:action "CheckInPresence" --no-interaction

# Policies
php artisan make:policy ProjectPolicy --no-interaction
php artisan make:policy ReimbursementPolicy --no-interaction
php artisan make:policy LeavePolicy --no-interaction

# Form Requests
php artisan make:request StoreProjectRequest --no-interaction
php artisan make:request UpdateProjectRequest --no-interaction
php artisan make:request StoreReimbursementRequest --no-interaction
php artisan make:request StoreLeaveRequest --no-interaction
php artisan make:request CheckInRequest --no-interaction
php artisan make:request ApproveReimbursementRequest --no-interaction
php artisan make:request ApproveLeaveRequest --no-interaction

# Controllers
php artisan make:controller ProjectController --no-interaction
php artisan make:controller ReimbursementController --no-interaction
php artisan make:controller LeaveController --no-interaction
php artisan make:controller PresenceController --no-interaction
php artisan make:controller Admin/UserController --no-interaction
php artisan make:controller Admin/DivisionController --no-interaction
```

### 2. Run Migrations
```bash
php artisan migrate
```

### 3. Format Code
```bash
vendor/bin/pint --dirty
```

### 4. Run Tests
```bash
php artisan test --filter=Project
```

### 5. Frontend: shadcn + npm
```bash
npx shadcn@latest init
npx shadcn@latest add button input label card badge table tabs dialog dropdown-menu sheet textarea select calendar separator breadcrumb tooltip avatar sonner toast
npm run build
composer run dev
```

---

## 📝 KEY NOTES FOR IMPLEMENTATION

1. **RoleGate Frontend**: Update to use `auth.user.role` from Inertia props
2. **Authorization**: Always check policies in controllers (use `authorize()` method or `can()` helper)
3. **File Uploads**: Use `Storage::disk('public')` for documents/photos
4. **Deferred Props**: Use Inertia v2 deferred props for large tables (add skeleton loaders)
5. **Validation**: Keep FormRequest rules; use policy methods for fine-grained auth
6. **Timestamps**: Auto-managed by Laravel; approvals use `approved_at` nullable timestamp
7. **Enum Casting**: Models use `casts()` method to cast enum columns
8. **Test Coverage**: At minimum, test: create operations (with role checks), approval flows, upload endpoints
9. **Relationships**: All models use explicit `HasMany`, `BelongsTo` with return types
10. **Routes**: Use `resource()` for standard CRUD, add custom routes for actions (finish, approve, check-in)

