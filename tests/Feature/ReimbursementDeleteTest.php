<?php

declare(strict_types=1);

use App\Models\Project;
use App\Models\Reimbursement;
use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function (): void {
    Role::query()->firstOrCreate(['name' => 'head']);
    Role::query()->firstOrCreate(['name' => 'finance']);
    Role::query()->firstOrCreate(['name' => 'pegawai']);

    if (App\Models\Division::query()->count() === 0) {
        App\Models\Division::factory()->create();
    }
});

test('reimbursement code is prefixed with double slash when soft deleted', function (): void {
    $user = User::factory()->create();
    $project = Project::factory()->create();

    $originalCode = 'REIMB-12345';

    /** @var Reimbursement $reimbursement */
    $reimbursement = Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'code' => $originalCode,
    ]);

    expect($reimbursement->code)->toBe($originalCode);

    $reimbursement->delete();

    expect($reimbursement->code)->toBe('//'.$originalCode);

    $deletedReimbursement = Reimbursement::withTrashed()->find($reimbursement->id);
    expect($deletedReimbursement)->not->toBeNull()
        ->and($deletedReimbursement->code)->toBe('//'.$originalCode);

    $newReimbursement = Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'code' => $originalCode,
    ]);

    expect($newReimbursement->code)->toBe($originalCode);
});

test('reimbursement is completely removed and code is reusable when force deleted', function (): void {
    $user = User::factory()->create();
    $project = Project::factory()->create();

    $originalCode = 'REIMB-54321';

    /** @var Reimbursement $reimbursement */
    $reimbursement = Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'code' => $originalCode,
    ]);

    $reimbursement->forceDelete();

    expect(Reimbursement::withTrashed()->find($reimbursement->id))->toBeNull();

    $newReimbursement = Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'code' => $originalCode,
    ]);

    expect($newReimbursement->code)->toBe($originalCode);
});
