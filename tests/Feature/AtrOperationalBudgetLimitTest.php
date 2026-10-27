<?php

declare(strict_types=1);

use App\Enums\ReimbursementStatus;
use App\Enums\UserRole;
use App\Models\Project;
use App\Models\Reimbursement;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    $this->seed(RoleAndPermissionSeeder::class);
    Notification::fake();
    Storage::fake('public');
    $this->owner = User::factory()->withRole(UserRole::Pegawai)->create();
    $this->head = User::factory()->withRole(UserRole::Head)->create();
    $this->project = Project::factory()->create(['operational_budget' => 50130000, 'head_id' => $this->head->id]);
    $this->detail = $this->project->budgetDetails()->create([
        'item_name' => 'Survei', 'amount' => 50130000, 'created_by' => $this->owner->id,
    ]);
    $this->actingAs($this->owner);
});

it('rejects an over-budget ATR before creating records or uploading documents for every role', function (UserRole $role): void {
    $this->owner->syncRoles([$role->value]);
    Reimbursement::factory()->create(['project_id' => $this->project->id, 'amount' => 36060000, 'status' => 'transferred']);
    $count = Reimbursement::query()->count();

    $this->postJson('/api/v1/reimbursements', [
        'type' => 'atr', 'project_id' => $this->project->id, 'status' => 'submitted',
        'amount' => 39760000, 'approver_head_id' => $this->head->id,
        'documents' => [['file' => UploadedFile::fake()->create('budget.pdf', 10, 'application/pdf'), 'type' => 'supporting']],
    ])->assertUnprocessable()->assertJsonValidationErrors('amount');

    expect(Reimbursement::query()->count())->toBe($count)
        ->and(Storage::disk('public')->allFiles())->toBe([]);
    Notification::assertNothingSent();
})->with([UserRole::Pegawai, UserRole::Superadmin]);

it('allows the exact remaining amount and reserves it for later submissions', function (): void {
    Reimbursement::factory()->create(['project_id' => $this->project->id, 'amount' => 36060000]);
    $payload = ['type' => 'atr', 'project_id' => $this->project->id, 'amount' => 14070000, 'approver_head_id' => $this->head->id];
    $this->postJson('/api/v1/reimbursements', $payload)->assertCreated();
    $payload['amount'] = 0.01;
    $this->postJson('/api/v1/reimbursements', $payload)->assertUnprocessable()->assertJsonValidationErrors('amount');
});

it('does not count drafts, rejected or deleted ATRs, or another projects allocations', function (): void {
    foreach (['draft', 'rejected'] as $status) {
        Reimbursement::factory()->create(['project_id' => $this->project->id, 'amount' => 50130000, 'status' => $status]);
    }
    Reimbursement::factory()->create(['project_id' => $this->project->id, 'amount' => 50130000])->delete();
    Reimbursement::factory()->create(['amount' => 50130000]);
    $this->postJson('/api/v1/reimbursements', [
        'type' => 'atr', 'project_id' => $this->project->id, 'amount' => 50130000, 'approver_head_id' => $this->head->id,
    ])->assertCreated();
});

it('uses EER settlement and the actual ATR transfer when calculating what remains', function (string $eerType, float $expense): void {
    $atr = Reimbursement::factory()->create([
        'project_id' => $this->project->id, 'amount' => 39760000, 'transferred_amount' => 36060000, 'status' => 'transferred',
    ]);
    Reimbursement::factory()->create([
        'project_id' => $this->project->id, 'type' => 'eer', 'atr_id' => $atr->id, 'eer_type' => $eerType, 'amount' => $expense,
    ]);
    $available = 50130000 - $expense;
    $payload = ['type' => 'atr', 'project_id' => $this->project->id, 'amount' => $available + 0.01, 'approver_head_id' => $this->head->id];
    $this->postJson('/api/v1/reimbursements', $payload)->assertUnprocessable()->assertJsonValidationErrors('amount');
    $payload['amount'] = $available;
    $this->postJson('/api/v1/reimbursements', $payload)->assertCreated();
})->with([['refund', 35200217.0], ['reimbursement', 40000000.0]]);

it('uses the recorded transfer for an ATR still waiting for EER', function (): void {
    Reimbursement::factory()->create([
        'project_id' => $this->project->id, 'amount' => 39760000, 'transferred_amount' => 35296000, 'status' => 'transferred',
    ]);
    $this->postJson('/api/v1/reimbursements', [
        'type' => 'atr', 'project_id' => $this->project->id, 'amount' => 14834000, 'approver_head_id' => $this->head->id,
    ])->assertCreated();
});

it('allows saving an over-budget draft but rejects its submission without changing the draft', function (): void {
    $response = $this->postJson('/api/v1/reimbursements', [
        'type' => 'atr', 'project_id' => $this->project->id, 'status' => 'draft',
        'amount' => 60000000, 'approver_head_id' => $this->head->id,
    ])->assertCreated();
    $atr = Reimbursement::query()->findOrFail($response->json('data.id'));
    $this->postJson("/api/v1/reimbursements/{$atr->id}/resubmit", ['status' => 'submitted'])
        ->assertUnprocessable()->assertJsonValidationErrors('amount');
    expect($atr->fresh()->status)->toBe(ReimbursementStatus::Draft);
});

it('checks a revised ATR against the remaining budget without counting its old reservation twice', function (): void {
    Reimbursement::factory()->create(['project_id' => $this->project->id, 'amount' => 36060000]);
    $atr = Reimbursement::factory()->create([
        'user_id' => $this->owner->id, 'project_id' => $this->project->id, 'amount' => 9000000, 'status' => 'revision',
    ]);
    $item = $atr->items()->create(['project_budget_detail_id' => $this->detail->id, 'item_name' => 'Original', 'amount' => 9000000]);
    $budget = $atr->atrBudgetSelecteds()->create(['project_budget_detail_id' => $this->detail->id, 'amount' => 9000000]);
    $payload = [
        'status' => 'submitted', 'amount' => 39760000,
        'selected_budget_details' => [['project_budget_detail_id' => $this->detail->id, 'amount' => 39760000]],
        'items' => [['project_budget_detail_id' => $this->detail->id, 'item_name' => 'Updated', 'amount' => 39760000]],
        'documents' => [['file' => UploadedFile::fake()->create('revision.pdf', 10, 'application/pdf'), 'type' => 'supporting']],
    ];
    $this->postJson("/api/v1/reimbursements/{$atr->id}/resubmit", $payload)
        ->assertUnprocessable()->assertJsonValidationErrors('amount');
    expect((float) $atr->fresh()->amount)->toBe(9000000.0)
        ->and($atr->fresh()->status)->toBe(ReimbursementStatus::Revision)
        ->and($item->fresh()->deleted_at)->toBeNull()
        ->and($budget->fresh()->deleted_at)->toBeNull()
        ->and(Storage::disk('public')->allFiles())->toBe([]);

    $payload['amount'] = $payload['items'][0]['amount'] = $payload['selected_budget_details'][0]['amount'] = 14070000;
    unset($payload['documents']);
    $this->postJson("/api/v1/reimbursements/{$atr->id}/resubmit", $payload)->assertOk();
    expect((float) $atr->fresh()->amount)->toBe(14070000.0)
        ->and($atr->fresh()->status)->toBe(ReimbursementStatus::Revised);
});

it('rejects a low header amount used to hide a larger requested breakdown', function (string $key): void {
    $this->postJson('/api/v1/reimbursements', [
        'type' => 'atr', 'project_id' => $this->project->id, 'amount' => 1000, 'approver_head_id' => $this->head->id,
        $key => [['project_budget_detail_id' => $this->detail->id, 'item_name' => 'Expense', 'quantity' => 1, 'unit_price' => 60000000, 'amount' => 60000000]],
    ])->assertUnprocessable()->assertJsonValidationErrors('amount');
})->with(['items', 'selected_budget_details']);

it('checks stored draft items when submission sends only a status', function (): void {
    $atr = Reimbursement::factory()->create([
        'user_id' => $this->owner->id, 'project_id' => $this->project->id, 'amount' => 1000, 'status' => 'draft',
    ]);
    $atr->items()->create(['project_budget_detail_id' => $this->detail->id, 'item_name' => 'Expense', 'amount' => 60000000]);
    $this->postJson("/api/v1/reimbursements/{$atr->id}/resubmit", ['status' => 'submitted'])
        ->assertUnprocessable()->assertJsonValidationErrors('amount');
    expect($atr->fresh()->status)->toBe(ReimbursementStatus::Draft);
});

it('checks the destination projects budget before moving a revised ATR', function (): void {
    $destination = Project::factory()->create(['operational_budget' => 1000]);
    $atr = Reimbursement::factory()->create([
        'user_id' => $this->owner->id, 'project_id' => $this->project->id, 'amount' => 2000, 'status' => 'revision',
    ]);
    $this->postJson("/api/v1/reimbursements/{$atr->id}/resubmit", ['status' => 'submitted', 'project_id' => $destination->id])
        ->assertUnprocessable()->assertJsonValidationErrors('amount');
    expect($atr->fresh()->project_id)->toBe($this->project->id);
});

it('requires a project when submitting an ATR', function (): void {
    $this->postJson('/api/v1/reimbursements', ['type' => 'atr', 'amount' => 1000, 'approver_head_id' => $this->head->id])
        ->assertUnprocessable()->assertJsonValidationErrors('project_id');
});

it('enforces the same limit through the web submission route', function (): void {
    $count = Reimbursement::query()->count();
    $this->post('/reimbursements', [
        'type' => 'atr', 'project_id' => $this->project->id, 'amount' => 60000000, 'approver_head_id' => $this->head->id,
    ])->assertRedirect()->assertSessionHasErrors('amount');
    expect(Reimbursement::query()->count())->toBe($count);
});

it('preserves ownership checks on ATR resubmission', function (): void {
    $atr = Reimbursement::factory()->create(['project_id' => $this->project->id, 'status' => 'revision']);
    $this->postJson("/api/v1/reimbursements/{$atr->id}/resubmit", ['status' => 'submitted', 'amount' => 1000])->assertForbidden();
});
