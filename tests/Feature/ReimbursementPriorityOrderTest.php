<?php

declare(strict_types=1);

use App\Enums\ReimbursementStatus;
use App\Enums\ReimbursementType;
use App\Enums\UserRole;
use App\Models\Project;
use App\Models\Reimbursement;
use App\Models\User;
use App\Services\ReimbursementService;
use Spatie\Permission\Models\Role;

beforeEach(function (): void {
    foreach (UserRole::cases() as $role) {
        Role::query()->firstOrCreate(['name' => $role->value, 'guard_name' => 'web']);
    }
});

test('role priority sorts ATRs before pagination and retains the selected secondary sort', function (UserRole $role, ReimbursementStatus $status, string $tab): void {
    $user = User::factory()->withRole($role)->create();
    $project = Project::factory()->create(['division_id' => $user->division_id]);
    $factory = Reimbursement::factory()->state(['user_id' => $user->id, 'project_id' => $project->id]);
    $normal = $factory->create([
        'code' => 'A-NORMAL',
        'status' => $status === ReimbursementStatus::Revision ? ReimbursementStatus::Revised : ReimbursementStatus::Revision,
    ]);
    $second = $factory->create(['code' => 'C-PRIORITY', 'status' => $status]);
    $first = $factory->create(['code' => 'B-PRIORITY', 'status' => $status]);
    $other = User::factory()->create();
    $hiddenProject = Project::factory()->create(['division_id' => $other->division_id]);
    $factory->create(['user_id' => $other->id, 'project_id' => $hiddenProject->id, 'status' => $status, 'code' => 'A-HIDDEN']);

    $results = app(ReimbursementService::class)->listReimbursements($user, [
        'type' => $tab, 'sort_by' => 'code', 'sort_dir' => 'asc',
    ], 1);

    expect($results->total())->toBe(3)
        ->and($results->items()[0]->id)->toBe($first->id);

    $results = app(ReimbursementService::class)->listReimbursements($user, [
        'type' => $tab, 'sort_by' => 'code', 'sort_dir' => 'asc',
    ]);

    expect($results->getCollection()->modelKeys())->toBe([$first->id, $second->id, $normal->id]);
})->with([
    [UserRole::Pegawai, ReimbursementStatus::Revision],
    [UserRole::Head, ReimbursementStatus::Revised],
    [UserRole::Finance, ReimbursementStatus::Revised],
])->with(['atr', '']);

test('priority EER moves its parent and itself first while respecting active filters', function (UserRole $role, ReimbursementStatus $status, string $tab): void {
    $user = User::factory()->withRole($role)->create();
    $project = Project::factory()->create(['division_id' => $user->division_id]);
    $factory = Reimbursement::factory()->state(['user_id' => $user->id, 'project_id' => $project->id]);
    $normal = $factory->create(['created_at' => now()]);
    $priority = $factory->create(['created_at' => now()->subDays(3)]);
    $eerFactory = $factory->state(['type' => ReimbursementType::EER]);
    $eerFactory->create(['atr_id' => $normal->id]);
    $eerFactory->create(['atr_id' => $priority->id]);
    $eer = $eerFactory->create(['atr_id' => $priority->id, 'status' => $status, 'created_at' => now()->subDays(2)]);

    $service = app(ReimbursementService::class);
    $results = $service->listReimbursements($user, ['type' => $tab], 1);

    expect($results->items()[0]->id)->toBe($priority->id)
        ->and($results->items()[0]->eers->first()->id)->toBe($eer->id);

    // A priority EER outside the date filter must not promote its parent.
    $results = $service->listReimbursements($user, ['type' => $tab, 'start_date' => now()->toDateString()]);

    expect($results->getCollection()->modelKeys())->toBe([$normal->id, $priority->id])
        ->and($results->items()[1]->eers->modelKeys())->not->toContain($eer->id);

    $eer->delete();
    $results = $service->listReimbursements($user, ['type' => $tab]);

    expect($results->items()[0]->id)->toBe($normal->id);
})->with([
    [UserRole::Pegawai, ReimbursementStatus::Revision],
    [UserRole::Head, ReimbursementStatus::Revised],
    [UserRole::Finance, ReimbursementStatus::Revised],
])->with(['atr', 'eer']);

test('allowance and other roles retain their existing ordering', function (UserRole $role, string $type): void {
    $user = User::factory()->withRole($role)->create();
    $project = Project::factory()->create(['division_id' => $user->division_id]);
    $factory = Reimbursement::factory()->state(['user_id' => $user->id, 'project_id' => $project->id, 'type' => $type]);
    $normal = $factory->create(['created_at' => now()]);
    $revision = $factory->create(['status' => ReimbursementStatus::Revision, 'created_at' => now()->subDay()]);
    $revised = $factory->create(['status' => ReimbursementStatus::Revised, 'created_at' => now()->subDays(2)]);

    $results = app(ReimbursementService::class)->listReimbursements($user, ['type' => $type]);

    expect($results->getCollection()->modelKeys())->toBe([$normal->id, $revision->id, $revised->id]);
})->with([
    [UserRole::Superadmin, 'atr'],
    [UserRole::Direktur, 'atr'],
    [UserRole::HR, 'atr'],
    [UserRole::Pegawai, 'allowance'],
    [UserRole::Head, 'allowance'],
    [UserRole::Finance, 'allowance'],
]);
