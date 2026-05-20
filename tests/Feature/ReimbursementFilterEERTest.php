<?php

declare(strict_types=1);

use App\Enums\ReimbursementStatus;
use App\Enums\ReimbursementType;
use App\Models\Project;
use App\Models\Reimbursement;
use App\Models\User;
use App\Services\ReimbursementService;
use Spatie\Permission\Models\Role;

beforeEach(function (): void {
    Role::query()->firstOrCreate(['name' => 'head']);
    Role::query()->firstOrCreate(['name' => 'finance']);
    Role::query()->firstOrCreate(['name' => 'pegawai']);
    Role::query()->firstOrCreate(['name' => 'superadmin']);
    Role::query()->firstOrCreate(['name' => 'hr']);
    Role::query()->firstOrCreate(['name' => 'direktur']);

    if (App\Models\Division::query()->count() === 0) {
        App\Models\Division::factory()->create();
    }
});

test('filtering by status on ATR tab returns ATRs whose child EER matches', function (): void {
    $service = app(ReimbursementService::class);
    $user = User::factory()->create();
    $user->assignRole('superadmin');

    $project = Project::factory()->create();

    // ATR that is transferred (no EER with submitted status)
    Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::ATR,
        'status' => ReimbursementStatus::Transferred,
        'code' => 'ATR-NO-EER',
    ]);

    // ATR that has a child EER with submitted status
    $atrWithEer = Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::ATR,
        'status' => ReimbursementStatus::Transferred,
        'code' => 'ATR-WITH-EER',
    ]);

    Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::EER,
        'status' => ReimbursementStatus::Submitted,
        'atr_id' => $atrWithEer->id,
        'code' => 'EER-SUBMITTED',
    ]);

    // Filter by type=atr, status=submitted
    $results = $service->listReimbursements($user, [
        'type' => 'atr',
        'status' => 'submitted',
    ]);

    // Only the ATR that has a submitted EER should be returned
    expect($results->total())->toBe(1)
        ->and($results->items()[0]->code)->toBe('ATR-WITH-EER');
});

test('filtered eers eager load only contains matching EERs', function (): void {
    $service = app(ReimbursementService::class);
    $user = User::factory()->create();
    $user->assignRole('superadmin');

    $project = Project::factory()->create();

    $atr = Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::ATR,
        'status' => ReimbursementStatus::Transferred,
        'code' => 'ATR-MULTI-EER',
    ]);

    // EER with submitted status
    Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::EER,
        'status' => ReimbursementStatus::Submitted,
        'atr_id' => $atr->id,
        'code' => 'EER-SUB-1',
    ]);

    // EER with approved status
    Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::EER,
        'status' => ReimbursementStatus::Approved,
        'atr_id' => $atr->id,
        'code' => 'EER-APPROVED-1',
    ]);

    $results = $service->listReimbursements($user, [
        'type' => 'atr',
        'status' => 'submitted',
    ]);

    $parentAtr = $results->items()[0];
    $loadedEers = $parentAtr->eers;

    // Only the submitted EER should be eager-loaded
    expect($loadedEers)->toHaveCount(1)
        ->and($loadedEers->first()->code)->toBe('EER-SUB-1');
});

test('search filter on ATR tab finds ATRs by child EER code', function (): void {
    $service = app(ReimbursementService::class);
    $user = User::factory()->create();
    $user->assignRole('superadmin');

    $project = Project::factory()->create();

    // ATR without matching EER
    Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::ATR,
        'status' => ReimbursementStatus::Transferred,
        'code' => 'ATR-ALPHA',
    ]);

    // ATR with EER whose code matches the search
    $atr = Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::ATR,
        'status' => ReimbursementStatus::Transferred,
        'code' => 'ATR-BETA',
    ]);

    Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::EER,
        'status' => ReimbursementStatus::Submitted,
        'atr_id' => $atr->id,
        'code' => 'EER-UNIQUE-SEARCH-TERM',
    ]);

    $results = $service->listReimbursements($user, [
        'type' => 'atr',
        'search' => 'UNIQUE-SEARCH-TERM',
    ]);

    expect($results->total())->toBe(1)
        ->and($results->items()[0]->code)->toBe('ATR-BETA');
});

test('without EER filters all ATRs are returned with all EERs', function (): void {
    $service = app(ReimbursementService::class);
    $user = User::factory()->create();
    $user->assignRole('superadmin');

    $project = Project::factory()->create();

    $atr = Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::ATR,
        'status' => ReimbursementStatus::Transferred,
        'code' => 'ATR-ALL',
    ]);

    Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::EER,
        'status' => ReimbursementStatus::Submitted,
        'atr_id' => $atr->id,
        'code' => 'EER-ALL-1',
    ]);

    Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::EER,
        'status' => ReimbursementStatus::Approved,
        'atr_id' => $atr->id,
        'code' => 'EER-ALL-2',
    ]);

    // No status filter, just type=atr
    $results = $service->listReimbursements($user, [
        'type' => 'atr',
    ]);

    expect($results->total())->toBe(1);

    $parentAtr = $results->items()[0];

    // Both EERs should be loaded since no filter constrains them
    expect($parentAtr->eers)->toHaveCount(2);
});
