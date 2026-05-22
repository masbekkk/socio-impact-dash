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

test('EER tab fetches only ATRs that have EERs when no filters are set', function (): void {
    $service = app(ReimbursementService::class);
    $user = User::factory()->create();
    $user->assignRole('superadmin');

    $project = Project::factory()->create();

    // ATR without EER
    Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::ATR,
        'status' => ReimbursementStatus::Transferred,
        'code' => 'ATR-NO-EER',
    ]);

    // ATR with EER
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
        'code' => 'EER-SUB',
    ]);

    $results = $service->listReimbursements($user, [
        'type' => 'eer',
    ]);

    // Should only return the ATR that has at least one EER
    expect($results->total())->toBe(1)
        ->and($results->items()[0]->code)->toBe('ATR-WITH-EER');
});

test('EER tab status filter matches only child EER status and ignores parent ATR status', function (): void {
    $service = app(ReimbursementService::class);
    $user = User::factory()->create();
    $user->assignRole('superadmin');

    $project = Project::factory()->create();

    // ATR (status = draft) with EER (status = submitted)
    $atr1 = Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::ATR,
        'status' => ReimbursementStatus::Draft,
        'code' => 'ATR-DRAFT',
    ]);

    Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::EER,
        'status' => ReimbursementStatus::Submitted,
        'atr_id' => $atr1->id,
        'code' => 'EER-SUBMITTED-1',
    ]);

    // ATR (status = submitted) with EER (status = approved)
    $atr2 = Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::ATR,
        'status' => ReimbursementStatus::Submitted,
        'code' => 'ATR-SUBMITTED',
    ]);

    Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::EER,
        'status' => ReimbursementStatus::Approved,
        'atr_id' => $atr2->id,
        'code' => 'EER-APPROVED-1',
    ]);

    // Query status = submitted.
    // ATR-DRAFT should be returned (because its EER is submitted).
    // ATR-SUBMITTED should NOT be returned (because its EER is approved).
    $results = $service->listReimbursements($user, [
        'type' => 'eer',
        'status' => 'submitted',
    ]);

    expect($results->total())->toBe(1)
        ->and($results->items()[0]->code)->toBe('ATR-DRAFT');
});

test('EER tab date filter matches only child EER date and ignores parent ATR date', function (): void {
    $service = app(ReimbursementService::class);
    $user = User::factory()->create();
    $user->assignRole('superadmin');

    $project = Project::factory()->create();

    // ATR created 2026-05-01, EER created 2026-05-15
    $atr1 = Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::ATR,
        'created_at' => '2026-05-01 10:00:00',
        'code' => 'ATR-OLD',
    ]);

    Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::EER,
        'created_at' => '2026-05-15 10:00:00',
        'atr_id' => $atr1->id,
        'code' => 'EER-NEW',
    ]);

    // ATR created 2026-05-15, EER created 2026-05-01
    $atr2 = Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::ATR,
        'created_at' => '2026-05-15 10:00:00',
        'code' => 'ATR-NEW-PARENTS',
    ]);

    Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::EER,
        'created_at' => '2026-05-01 10:00:00',
        'atr_id' => $atr2->id,
        'code' => 'EER-OLD',
    ]);

    // Filter date >= 2026-05-10
    // ATR-OLD should be returned (EER is 2026-05-15).
    // ATR-NEW-PARENTS should NOT be returned (EER is 2026-05-01).
    $results = $service->listReimbursements($user, [
        'type' => 'eer',
        'start_date' => '2026-05-10',
    ]);

    expect($results->total())->toBe(1)
        ->and($results->items()[0]->code)->toBe('ATR-OLD');
});

test('EER tab search filter matches only child EER fields and ignores parent ATR fields', function (): void {
    $service = app(ReimbursementService::class);
    $user = User::factory()->create();
    $user->assignRole('superadmin');

    $project = Project::factory()->create();

    // ATR code matching search, but EER code not matching
    $atr1 = Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::ATR,
        'code' => 'ATR-TARGET',
    ]);

    Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::EER,
        'code' => 'EER-OTHER',
        'atr_id' => $atr1->id,
    ]);

    // ATR code not matching, but EER code matching search
    $atr2 = Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::ATR,
        'code' => 'ATR-OTHER',
    ]);

    Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'type' => ReimbursementType::EER,
        'code' => 'EER-TARGET',
        'atr_id' => $atr2->id,
    ]);

    // Search for "TARGET"
    // ATR-OTHER should be returned because its EER is EER-TARGET
    $results = $service->listReimbursements($user, [
        'type' => 'eer',
        'search' => 'TARGET',
    ]);

    expect($results->total())->toBe(1)
        ->and($results->items()[0]->code)->toBe('ATR-OTHER');
});
