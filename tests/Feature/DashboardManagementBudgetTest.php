<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Actions\GetManagementBudgetOverview;
use App\Enums\UserRole;
use App\Models\Project;
use App\Models\Reimbursement;
use App\Models\User;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

final class DashboardManagementBudgetTest extends TestCase
{
    public function test_pool_matches_global_allocations_and_excludes_deleted_projects(): void
    {
        Project::factory()->create(['management_budget' => 30000000]);
        Project::factory()->create(['management_budget' => 20000000, 'status' => 'draft']);
        Project::factory()->create(['management_budget' => 90000000])->delete();
        $internal = Project::factory()->create([
            'project_type' => 'non-project',
            'budget_total' => 10000000,
            'management_budget' => 0,
        ]);
        $internal->yearClaims()->create(['year' => 2025, 'amount' => 10000000]);
        Project::factory()->create([
            'project_type' => 'non-project',
            'budget_total' => 15000000,
            'management_budget' => 0,
        ]);
        Project::factory()->create(['project_type' => 'non-project', 'budget_total' => 80000000])->delete();

        $data = app(GetManagementBudgetOverview::class)->handle();

        self::assertSame(50000000.0, $data['total_management_budget']);
        self::assertSame(25000000.0, $data['allocated_budget']);
        self::assertSame(25000000.0, $data['available_budget']);
        self::assertSame(0.0, $data['overallocated_budget']);
        self::assertCount(2, $data['projects']);
        self::assertSame($internal->uuid, $data['projects'][1]['uuid']);
    }

    public function test_usage_counts_pending_atr_eer_and_allowance_without_counting_converted_atr_twice(): void
    {
        $project = Project::factory()->create([
            'project_type' => 'non-project',
            'budget_total' => 20000000,
            'management_budget' => 0,
        ]);
        $atr = Reimbursement::factory()->create(['project_id' => $project->id, 'amount' => 4000000]);
        Reimbursement::factory()->create(['project_id' => $project->id, 'amount' => 5000000]);
        Reimbursement::factory()->create([
            'project_id' => $project->id,
            'atr_id' => $atr->id,
            'type' => 'eer',
            'amount' => 3000000,
        ]);
        Reimbursement::factory()->create(['project_id' => $project->id, 'type' => 'allowance', 'amount' => 2000000]);
        foreach (['atr', 'eer', 'allowance'] as $type) {
            foreach (['draft', 'rejected'] as $status) {
                Reimbursement::factory()->create(['project_id' => $project->id, 'type' => $type, 'status' => $status, 'amount' => 99000000]);
            }
            Reimbursement::factory()->create(['project_id' => $project->id, 'type' => $type, 'amount' => 99000000])->delete();
        }
        Reimbursement::factory()->create(['project_id' => $project->id, 'type' => 'allowance', 'status' => 'revision', 'amount' => 99000000]);

        $data = app(GetManagementBudgetOverview::class)->handle();

        self::assertSame(5000000.0, $data['projects'][0]['pending_atr']);
        self::assertSame(3000000.0, $data['projects'][0]['used_eer']);
        self::assertSame(2000000.0, $data['projects'][0]['used_allowance']);
        self::assertSame(10000000.0, $data['projects'][0]['remaining_budget']);
        self::assertSame(10000000.0, $data['total_expenses']);
    }

    public function test_empty_and_overallocated_pools_are_reported_explicitly(): void
    {
        $empty = app(GetManagementBudgetOverview::class)->handle();
        self::assertSame(0.0, $empty['available_budget']);
        self::assertSame(0.0, $empty['total_expenses']);
        self::assertSame([], $empty['projects']);

        Project::factory()->create(['management_budget' => 10000000]);
        Project::factory()->create(['project_type' => 'non-project', 'budget_total' => 15000000, 'management_budget' => 0]);

        $data = app(GetManagementBudgetOverview::class)->handle();
        self::assertSame(0.0, $data['available_budget']);
        self::assertSame(5000000.0, $data['overallocated_budget']);
    }

    public function test_dashboard_shares_the_global_pool_only_with_financial_roles_regardless_of_kpi_year(): void
    {
        $this->withoutVite();
        Project::factory()->create(['management_budget' => 30000000]);
        Project::factory()->create(['project_type' => 'non-project', 'budget_total' => 10000000, 'management_budget' => 0]);

        foreach ([UserRole::Finance, UserRole::Direktur, UserRole::Superadmin] as $role) {
            $user = User::factory()->withRole($role)->create();
            $this->actingAs($user)->get(route('dashboard', ['year' => 2025]))
                ->assertOk()
                ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
                    ->component('Dashboard/Index')
                    ->where('managementBudgetOverview.total_management_budget', 30000000)
                    ->where('managementBudgetOverview.allocated_budget', 10000000)
                    ->where('managementBudgetOverview.available_budget', 20000000)
                    ->has('managementBudgetOverview.projects', 1)
                    ->etc());
        }

        foreach ([UserRole::Pegawai, UserRole::Head, UserRole::HR] as $role) {
            $user = User::factory()->withRole($role)->create();
            $this->actingAs($user)->get(route('dashboard'))
                ->assertOk()
                ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
                    ->where('managementBudgetOverview', null)
                    ->etc());
        }
        $this->app['auth']->forgetGuards();
        $this->get(route('dashboard'))->assertRedirect(route('login'));
    }
}
