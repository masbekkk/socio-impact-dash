<?php

declare(strict_types=1);

use App\Enums\ReimbursementStatus;
use App\Enums\ReimbursementType;
use App\Enums\UserRole;
use App\Exports\ReimbursementExport;
use App\Exports\Sheets\AllowanceSheet;
use App\Exports\Sheets\AtrSheet;
use App\Models\Division;
use App\Models\Project;
use App\Models\Reimbursement;
use App\Models\User;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Permission\Models\Role;

beforeEach(function (): void {
    foreach (UserRole::cases() as $role) {
        Role::query()->firstOrCreate(['name' => $role->value, 'guard_name' => 'web']);
    }
});

test('export uses the EER view filters, selected sort, and matching EER children', function (): void {
    $user = User::factory()->withRole(UserRole::Superadmin)->create();
    $division = Division::factory()->create();
    $project = Project::factory()->create(['division_id' => $division->id]);
    $otherProject = Project::factory()->create(['division_id' => Division::factory()->create()->id]);

    foreach (['B-ATR', 'A-ATR'] as $code) {
        $atr = Reimbursement::factory()->create([
            'user_id' => $user->id, 'project_id' => $project->id,
            'code' => $code, 'status' => ReimbursementStatus::Transferred,
        ]);
        Reimbursement::factory()->create([
            'user_id' => $user->id, 'project_id' => $project->id,
            'atr_id' => $atr->id, 'type' => ReimbursementType::EER,
            'code' => 'EER-OLD-'.$code, 'status' => ReimbursementStatus::Approved,
        ]);
        Reimbursement::factory()->create([
            'user_id' => $user->id, 'project_id' => $project->id,
            'atr_id' => $atr->id, 'type' => ReimbursementType::EER,
            'code' => 'EER-MATCH-'.$code, 'status' => ReimbursementStatus::Submitted,
            'amount' => $code === 'A-ATR' ? 110 : 220,
        ]);
    }

    $hiddenAtr = Reimbursement::factory()->create([
        'user_id' => $user->id, 'project_id' => $otherProject->id,
    ]);
    Reimbursement::factory()->create([
        'user_id' => $user->id, 'project_id' => $otherProject->id,
        'atr_id' => $hiddenAtr->id, 'type' => ReimbursementType::EER,
        'code' => 'EER-MATCH-HIDDEN', 'status' => ReimbursementStatus::Submitted,
    ]);

    Excel::fake();
    $this->actingAs($user)->get(route('reimbursements.export-excel', [
        'type' => 'eer', 'status' => 'submitted', 'search' => 'EER-MATCH',
        'division_id' => $division->id,
        'start_date' => now()->toDateString(), 'end_date' => now()->toDateString(),
        'sort_by' => 'code', 'sort_dir' => 'asc',
    ]))->assertOk();

    Excel::assertDownloaded('export-reimbursement-'.now()->format('Y-m-d').'.xlsx', function (ReimbursementExport $export): bool {
        $sheets = $export->sheets();
        expect($sheets)->toHaveCount(1)
            ->and($sheets[0])->toBeInstanceOf(AtrSheet::class);

        $rows = $sheets[0]->collection()->values();
        $eerCodeColumn = array_search('Kode EER', $sheets[0]->headings(), true);
        $amountColumn = array_search('Nominal Pengeluaran EER', $sheets[0]->headings(), true);

        expect($rows)->toHaveCount(2)
            ->and($rows->pluck(0)->all())->toBe(['A-ATR', 'B-ATR'])
            ->and($rows->pluck($eerCodeColumn)->all())->toBe(['EER-MATCH-A-ATR', 'EER-MATCH-B-ATR'])
            ->and($rows->pluck($amountColumn)->all())->toBe([110.0, 220.0]);

        return true;
    });
});

test('export includes every matching EER and supports allowance and all views', function (): void {
    $user = User::factory()->withRole(UserRole::Superadmin)->create();
    $project = Project::factory()->create();
    $atr = Reimbursement::factory()->create([
        'user_id' => $user->id, 'project_id' => $project->id, 'code' => 'ATR-ONE',
    ]);

    foreach (['EER-ONE', 'EER-TWO'] as $code) {
        Reimbursement::factory()->create([
            'user_id' => $user->id, 'project_id' => $project->id,
            'atr_id' => $atr->id, 'type' => ReimbursementType::EER, 'code' => $code,
        ]);
    }

    Reimbursement::factory()->create([
        'user_id' => $user->id, 'project_id' => $project->id,
        'type' => ReimbursementType::ALLOWANCE, 'code' => 'ALLOWANCE-MATCH',
    ]);
    Reimbursement::factory()->create([
        'user_id' => $user->id, 'project_id' => $project->id,
        'type' => ReimbursementType::ALLOWANCE, 'code' => 'ALLOWANCE-OTHER',
    ]);

    $sheets = (new ReimbursementExport($user))->sheets();
    $eerCodeColumn = array_search('Kode EER', $sheets[0]->headings(), true);
    expect($sheets)->toHaveCount(2)
        ->and($sheets[0]->collection()->pluck(0)->all())->toBe(['ATR-ONE', 'ATR-ONE'])
        ->and($sheets[0]->collection()->pluck($eerCodeColumn)->all())->toEqualCanonicalizing(['EER-ONE', 'EER-TWO'])
        ->and($sheets[1])->toBeInstanceOf(AllowanceSheet::class)
        ->and($sheets[1]->collection()->pluck(0)->all())->toContain('ALLOWANCE-MATCH', 'ALLOWANCE-OTHER');

    $allowanceSheets = (new ReimbursementExport($user, [
        'type' => 'allowance', 'search' => 'MATCH',
    ]))->sheets();

    expect($allowanceSheets)->toHaveCount(1)
        ->and($allowanceSheets[0])->toBeInstanceOf(AllowanceSheet::class)
        ->and(count($allowanceSheets[0]->headings()))->toBe(count($allowanceSheets[0]->collection()->first()))
        ->and($allowanceSheets[0]->collection()->pluck(0)->all())->toBe(['ALLOWANCE-MATCH']);
});

test('export respects reimbursement ownership', function (): void {
    $user = User::factory()->withRole(UserRole::Pegawai)->create();
    $other = User::factory()->create();
    $project = Project::factory()->create();
    Reimbursement::factory()->create(['user_id' => $user->id, 'project_id' => $project->id, 'code' => 'OWN-ATR']);
    Reimbursement::factory()->create(['user_id' => $other->id, 'project_id' => $project->id, 'code' => 'OTHER-ATR']);

    $sheets = (new ReimbursementExport($user, ['type' => 'atr']))->sheets();

    expect($sheets[0]->collection()->pluck(0)->all())->toBe(['OWN-ATR']);
});
