<?php

declare(strict_types=1);

use App\Enums\ReimbursementStatus;
use App\Enums\ReimbursementType;
use App\Models\Reimbursement;
use App\Models\User;
use Spatie\Permission\Models\Role;

test('repair closes only approved balance EERs with active finance and director approvals', function (): void {
    foreach (['pegawai', 'head', 'finance', 'direktur'] as $role) {
        Role::query()->firstOrCreate(['name' => $role]);
    }
    $approver = User::factory()->create();

    $makeEer = function (string $eerType, ReimbursementStatus $status, bool $financeApproved, bool $directorApproved) use ($approver): Reimbursement {
        $eer = Reimbursement::factory()->create([
            'type' => ReimbursementType::EER,
            'eer_type' => $eerType,
            'status' => $status,
            'transfer_proof_path' => null,
            'transferred_at' => null,
        ]);
        $eer->approvals()->create([
            'approver_id' => $approver->id,
            'role' => 'finance',
            'status' => $financeApproved ? 'approved' : 'pending',
        ]);
        $eer->approvals()->create([
            'approver_id' => $approver->id,
            'role' => 'direktur',
            'status' => $directorApproved ? 'approved' : 'pending',
        ]);

        return $eer;
    };

    $staleBalance = $makeEer('balance', ReimbursementStatus::Approved, true, true);
    $pendingDirector = $makeEer('balance', ReimbursementStatus::Approved, true, false);
    $pendingFinance = $makeEer('balance', ReimbursementStatus::Approved, false, true);
    $refund = $makeEer('refund', ReimbursementStatus::Approved, true, true);
    $reimbursement = $makeEer('reimbursement', ReimbursementStatus::Approved, true, true);
    $requestFund = $makeEer('balance', ReimbursementStatus::Requested, true, true);
    $deleted = $makeEer('balance', ReimbursementStatus::Approved, true, true);
    $deleted->delete();

    $migration = require database_path('migrations/2026_10_29_000001_close_director_approved_balance_eers.php');
    $migration->up();
    $migration->up();

    expect($staleBalance->fresh()->status)->toBe(ReimbursementStatus::Closed)
        ->and($staleBalance->fresh()->transfer_proof_path)->toBeNull()
        ->and($staleBalance->fresh()->transferred_at)->toBeNull()
        ->and($pendingDirector->fresh()->status)->toBe(ReimbursementStatus::Approved)
        ->and($pendingFinance->fresh()->status)->toBe(ReimbursementStatus::Approved)
        ->and($refund->fresh()->status)->toBe(ReimbursementStatus::Approved)
        ->and($reimbursement->fresh()->status)->toBe(ReimbursementStatus::Approved)
        ->and($requestFund->fresh()->status)->toBe(ReimbursementStatus::Requested)
        ->and($deleted->fresh()->status)->toBe(ReimbursementStatus::Approved);
});
