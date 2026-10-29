<?php

declare(strict_types=1);

use App\Enums\ReimbursementStatus;
use App\Enums\ReimbursementType;
use App\Models\Reimbursement;
use App\Models\User;
use Inertia\Testing\AssertableInertia;
use Spatie\Permission\Models\Role;

beforeEach(function (): void {
    foreach (['head', 'finance', 'direktur', 'pegawai'] as $role) {
        Role::query()->firstOrCreate(['name' => $role]);
    }

    $this->withoutVite();
});

test('director dashboard lists transferred EER but keeps other reimbursement stages', function (string $eerType): void {
    $director = User::factory()->create();
    $director->assignRole('direktur');
    $employee = User::factory()->create();
    $employee->assignRole('pegawai');

    $sourceAtr = Reimbursement::factory()->create([
        'user_id' => $employee->id,
        'type' => ReimbursementType::ATR,
        'status' => ReimbursementStatus::Transferred,
        'amount' => 400000,
    ]);

    $transferredEer = Reimbursement::factory()->create([
        'user_id' => $employee->id,
        'atr_id' => $sourceAtr->id,
        'project_id' => $sourceAtr->project_id,
        'type' => ReimbursementType::EER,
        'eer_type' => $eerType,
        'status' => ReimbursementStatus::Transferred,
        'amount' => 300000,
    ]);
    $transferredEer->approvals()->create([
        'approver_id' => $employee->id,
        'role' => 'finance',
        'status' => 'approved',
    ]);
    $transferredEer->approvals()->create([
        'approver_id' => $director->id,
        'role' => 'direktur',
        'status' => 'pending',
    ]);

    Reimbursement::factory()->create([
        'user_id' => $employee->id,
        'type' => ReimbursementType::EER,
        'status' => ReimbursementStatus::FinanceApproved,
        'eer_type' => $eerType,
    ]);
    Reimbursement::factory()->create([
        'user_id' => $employee->id,
        'type' => ReimbursementType::EER,
        'status' => ReimbursementStatus::Closed,
    ]);
    $atr = Reimbursement::factory()->create([
        'user_id' => $employee->id,
        'type' => ReimbursementType::ATR,
        'status' => ReimbursementStatus::FinanceApproved,
    ]);
    $allowance = Reimbursement::factory()->create([
        'user_id' => $employee->id,
        'type' => ReimbursementType::ALLOWANCE,
        'status' => ReimbursementStatus::HRApproved,
    ]);

    $expectedIds = [$transferredEer->id, $atr->id, $allowance->id];
    sort($expectedIds);

    $this->actingAs($director)->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('Dashboard/Index')
            ->where('approvalItems.direktur_reimbursements', function ($items) use ($expectedIds, $transferredEer, $sourceAtr): bool {
                $actualIds = collect($items)->pluck('id')->sort()->values()->all();
                $eer = collect($items)->firstWhere('id', $transferredEer->id);

                return $actualIds === $expectedIds
                    && $eer['can_approve'] === true
                    && $eer['atr_code'] === $sourceAtr->code
                    && (float) $eer['atr_amount'] === 400000.0
                    && (float) $eer['amount'] === 300000.0;
            })
            ->etc());

    $this->postJson("/api/v1/reimbursements/{$transferredEer->id}/status", [
        'action' => 'approved',
        'role' => 'direktur',
    ])->assertOk();

    expect($transferredEer->fresh()->status)->toBe(ReimbursementStatus::Closed);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->where('approvalItems.direktur_reimbursements', fn ($items): bool => ! collect($items)->pluck('id')->contains($transferredEer->id))
            ->etc());
})->with(['refund', 'reimbursement']);

test('director closes balance EER directly after finance approval', function (bool $bulk): void {
    $director = User::factory()->create();
    $director->assignRole('direktur');
    $finance = User::factory()->create();
    $finance->assignRole('finance');
    $eer = Reimbursement::factory()->create([
        'type' => ReimbursementType::EER,
        'eer_type' => 'balance',
        'status' => ReimbursementStatus::HeadApproved,
        'transfer_proof_path' => null,
        'transferred_at' => null,
    ]);
    $eer->approvals()->create([
        'approver_id' => $finance->id,
        'role' => 'finance',
        'status' => 'pending',
    ]);
    $eer->approvals()->create([
        'approver_id' => $director->id,
        'role' => 'direktur',
        'status' => 'pending',
    ]);

    $this->actingAs($director)->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->where('approvalItems.direktur_reimbursements', fn ($items): bool => ! collect($items)->pluck('id')->contains($eer->id))
            ->etc());

    $this->actingAs($finance)->postJson("/api/v1/reimbursements/{$eer->id}/status", [
        'action' => 'approved',
        'role' => 'finance',
    ])->assertOk();
    expect($eer->fresh()->status)->toBe(ReimbursementStatus::FinanceApproved);

    $this->actingAs($director)->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->where('approvalItems.direktur_reimbursements', function ($items) use ($eer): bool {
                $item = collect($items)->firstWhere('id', $eer->id);

                return $item !== null && $item['can_approve'] === true;
            })
            ->etc());

    if ($bulk) {
        $this->post(route('reimbursements.bulk-approve'), [
            'ids' => [$eer->id],
            'role' => 'direktur',
        ])->assertRedirect();
    } else {
        $this->postJson("/api/v1/reimbursements/{$eer->id}/status", [
            'action' => 'approved',
            'role' => 'direktur',
        ])->assertOk();
    }

    $eer->refresh();
    expect($eer->status)->toBe(ReimbursementStatus::Closed)
        ->and($eer->transfer_proof_path)->toBeNull()
        ->and($eer->transferred_at)->toBeNull();

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->where('approvalItems.direktur_reimbursements', fn ($items): bool => ! collect($items)->pluck('id')->contains($eer->id))
            ->etc());
})->with([false, true]);
