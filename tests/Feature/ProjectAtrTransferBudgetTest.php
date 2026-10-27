<?php

declare(strict_types=1);

use App\Enums\UserRole;
use App\Models\Project;
use App\Models\Reimbursement;
use App\Models\User;

beforeEach(function (): void {
    $this->seed(Database\Seeders\RoleAndPermissionSeeder::class);
});

it('uses transferred ATR amounts consistently in the summary, activity and document links', function (): void {
    $user = User::factory()->withRole(UserRole::Finance)->create();
    $project = Project::factory()->create(['operational_budget' => 50130000]);
    $detail = $project->budgetDetails()->create(['item_name' => 'Survei', 'amount' => 50130000, 'created_by' => $user->id]);
    $settled = Reimbursement::factory()->create([
        'project_id' => $project->id, 'amount' => 36060000, 'transferred_amount' => 36060000, 'status' => 'transferred',
    ]);
    $pending = Reimbursement::factory()->create([
        'project_id' => $project->id, 'amount' => 35296000, 'transferred_amount' => 35296000, 'status' => 'transferred',
    ]);
    foreach ([[$settled, 36060000], [$pending, 39760000]] as [$atr, $amount]) {
        $atr->items()->create(['project_budget_detail_id' => $detail->id, 'item_name' => 'Survei', 'amount' => $amount]);
        $atr->atrBudgetSelecteds()->create(['project_budget_detail_id' => $detail->id, 'amount' => $amount]);
    }
    $eer = Reimbursement::factory()->create([
        'project_id' => $project->id, 'atr_id' => $settled->id, 'type' => 'eer',
        'eer_type' => 'refund', 'status' => 'approved', 'amount' => 35200217,
    ]);
    $eer->items()->create(['project_budget_detail_id' => $detail->id, 'item_name' => 'Survei', 'amount' => 35200217]);

    $this->actingAs($user)->getJson("/api/v1/projects/{$project->uuid}")
        ->assertOk()
        ->assertJsonPath('data.pending_atr', 35296000)
        ->assertJsonPath('data.used_eer', 35200217)
        ->assertJsonPath('data.remaining_operational', -20366217)
        ->assertJsonPath('data.budget_details.0.pending_atr', 35296000)
        ->assertJsonPath('data.budget_details.0.requested_pending_atr', 39760000)
        ->assertJsonPath('data.budget_details.0.used_atr', 71356000)
        ->assertJsonPath('data.budget_details.0.atr_records.0.amount', 35296000)
        ->assertJsonPath('data.atr_records.0.amount', 35296000)
        ->assertJsonPath('data.atr_allocation_pending', false);

    expect((float) $pending->items()->sum('amount'))->toBe(39760000.0)
        ->and((float) $pending->atrBudgetSelecteds()->sum('amount'))->toBe(39760000.0);
});

it('replaces a transferred ATR with EER expense exactly once', function (string $type, int $expense): void {
    $user = User::factory()->withRole(UserRole::Finance)->create();
    $project = Project::factory()->create(['operational_budget' => 10000]);
    $detail = $project->budgetDetails()->create(['item_name' => 'Activity', 'amount' => 10000, 'created_by' => $user->id]);
    $atr = Reimbursement::factory()->create([
        'project_id' => $project->id, 'amount' => 5000, 'transferred_amount' => 4000, 'status' => 'transferred',
    ]);
    $atr->items()->create(['project_budget_detail_id' => $detail->id, 'item_name' => 'Requested', 'amount' => 5000]);
    $eer = Reimbursement::factory()->create([
        'project_id' => $project->id, 'atr_id' => $atr->id, 'type' => 'eer', 'eer_type' => $type, 'amount' => $expense,
    ]);
    $eer->items()->create(['project_budget_detail_id' => $detail->id, 'item_name' => 'Expense', 'amount' => $expense]);

    $this->actingAs($user)->getJson("/api/v1/projects/{$project->uuid}")
        ->assertOk()
        ->assertJsonPath('data.used_atr', 4000)
        ->assertJsonPath('data.pending_atr', 0)
        ->assertJsonPath('data.used_eer', $expense)
        ->assertJsonPath('data.remaining_operational', 10000 - $expense)
        ->assertJsonPath('data.budget_details.0.used_atr', 4000)
        ->assertJsonPath('data.budget_details.0.pending_atr', 0)
        ->assertJsonPath('data.budget_details.0.used_eer', $expense)
        ->assertJsonPath('data.budget_details.0.converted_atr_records.0.amount', 4000);

    $eer->delete();
    $this->getJson("/api/v1/projects/{$project->uuid}")
        ->assertOk()
        ->assertJsonPath('data.pending_atr', 4000)
        ->assertJsonPath('data.used_eer', 0)
        ->assertJsonPath('data.remaining_operational', 6000);
})->with([['refund', 3500], ['reimbursement', 4500], ['balance', 4000]]);

it('keeps the project total while marking an ambiguous activity split unresolved', function (): void {
    $user = User::factory()->withRole(UserRole::Finance)->create();
    $project = Project::factory()->create(['operational_budget' => 10000]);
    $atr = Reimbursement::factory()->create([
        'project_id' => $project->id, 'amount' => 8000, 'transferred_amount' => 8000, 'status' => 'transferred',
    ]);
    foreach ([6000, 4000] as $amount) {
        $detail = $project->budgetDetails()->create(['item_name' => 'Activity', 'amount' => $amount, 'created_by' => $user->id]);
        $atr->items()->create(['project_budget_detail_id' => $detail->id, 'item_name' => 'Requested', 'amount' => $amount]);
    }

    $this->actingAs($user)->getJson("/api/v1/projects/{$project->uuid}")
        ->assertOk()
        ->assertJsonPath('data.pending_atr', 8000)
        ->assertJsonPath('data.remaining_operational', 2000)
        ->assertJsonPath('data.atr_records.0.amount', 8000)
        ->assertJsonPath('data.atr_allocation_pending', true)
        ->assertJsonPath('data.budget_details.0.pending_atr', null)
        ->assertJsonPath('data.budget_details.1.pending_atr', null)
        ->assertJsonPath('data.budget_details.0.atr_records.0.amount', null);

    $atr->update(['transferred_amount' => 10000]);
    $this->getJson("/api/v1/projects/{$project->uuid}")
        ->assertOk()
        ->assertJsonPath('data.pending_atr', 10000)
        ->assertJsonPath('data.atr_allocation_pending', false)
        ->assertJsonPath('data.budget_details.0.pending_atr', 6000)
        ->assertJsonPath('data.budget_details.1.pending_atr', 4000);
});

it('supports legacy selected budgets and an explicitly recorded zero transfer', function (): void {
    $user = User::factory()->withRole(UserRole::Finance)->create();
    $project = Project::factory()->create(['operational_budget' => 10000]);
    $detail = $project->budgetDetails()->create(['item_name' => 'Activity', 'amount' => 10000, 'created_by' => $user->id]);
    $atr = Reimbursement::factory()->create([
        'project_id' => $project->id, 'amount' => 5000, 'transferred_amount' => 0, 'status' => 'transferred',
    ]);
    $atr->atrBudgetSelecteds()->create(['project_budget_detail_id' => $detail->id, 'amount' => 5000]);
    $this->actingAs($user)->getJson("/api/v1/projects/{$project->uuid}")
        ->assertOk()
        ->assertJsonPath('data.pending_atr', 0)
        ->assertJsonPath('data.remaining_operational', 10000)
        ->assertJsonPath('data.budget_details.0.pending_atr', 0)
        ->assertJsonPath('data.budget_details.0.requested_pending_atr', 5000);
});
