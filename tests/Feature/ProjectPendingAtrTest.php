<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Project;
use App\Models\Reimbursement;
use App\Models\User;
use Tests\TestCase;

final class ProjectPendingAtrTest extends TestCase
{
    public function test_project_displays_only_atrs_without_an_active_eer_as_pending(): void
    {
        $user = User::factory()->withRole(UserRole::Finance)->create();
        $project = Project::factory()->create([
            'operational_budget' => 100000000,
        ]);
        $detail = $project->budgetDetails()->create([
            'item_name' => 'Kegiatan',
            'amount' => 40000000,
            'created_by' => $user->id,
        ]);

        $atrA = Reimbursement::factory()->create([
            'project_id' => $project->id,
            'user_id' => $user->id,
            'amount' => 20000000,
        ]);
        $atrB = Reimbursement::factory()->create([
            'project_id' => $project->id,
            'user_id' => $user->id,
            'amount' => 20000000,
        ]);

        foreach ([$atrA, $atrB] as $atr) {
            $atr->items()->create([
                'project_budget_detail_id' => $detail->id,
                'item_name' => 'Kegiatan',
                'amount' => 20000000,
            ]);
        }

        $this->actingAs($user)->getJson("/api/v1/projects/{$project->uuid}")
            ->assertOk()
            ->assertJsonPath('data.pending_atr', 40000000)
            ->assertJsonPath('data.budget_details.0.pending_atr', 40000000)
            ->assertJsonCount(2, 'data.budget_details.0.atr_records');

        $eer = Reimbursement::factory()->create([
            'project_id' => $project->id,
            'user_id' => $user->id,
            'atr_id' => $atrA->id,
            'type' => 'eer',
            'eer_type' => 'reimbursement',
            'amount' => 30000000,
        ]);
        $eer->items()->create([
            'project_budget_detail_id' => $detail->id,
            'parent_item_id' => $atrA->items()->first()->id,
            'item_name' => 'Kegiatan',
            'amount' => 30000000,
        ]);

        $this->actingAs($user)->getJson("/api/v1/projects/{$project->uuid}")
            ->assertOk()
            ->assertJsonPath('data.pending_atr', 20000000)
            ->assertJsonPath('data.used_atr', 40000000)
            ->assertJsonPath('data.used_eer', 30000000)
            ->assertJsonPath('data.total_used_operational', 50000000)
            ->assertJsonPath('data.remaining_operational', 50000000)
            ->assertJsonPath('data.budget_details.0.pending_atr', 20000000)
            ->assertJsonPath('data.budget_details.0.used_eer', 30000000)
            ->assertJsonCount(1, 'data.budget_details.0.atr_records')
            ->assertJsonPath('data.budget_details.0.atr_records.0.id', $atrB->id)
            ->assertJsonPath('data.budget_details.0.atr_records.0.amount', 20000000)
            ->assertJsonPath('data.budget_details.0.eer_records.0.id', $eer->id)
            ->assertJsonPath('data.budget_details.0.eer_records.0.amount', 30000000);

        $eer->update(['status' => 'rejected']);

        $this->actingAs($user)->getJson("/api/v1/projects/{$project->uuid}")
            ->assertOk()
            ->assertJsonPath('data.pending_atr', 40000000)
            ->assertJsonPath('data.used_eer', 0)
            ->assertJsonCount(0, 'data.budget_details.0.eer_records');
    }
}
