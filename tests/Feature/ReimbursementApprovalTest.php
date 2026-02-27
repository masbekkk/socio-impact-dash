<?php

declare(strict_types=1);

use App\Enums\ReimbursementStatus;
use App\Models\Project;
use App\Models\Reimbursement;
use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Ensure roles exist
    Role::firstOrCreate(['name' => 'head']);
    Role::firstOrCreate(['name' => 'finance']);
    Role::firstOrCreate(['name' => 'pegawai']);

    if (\App\Models\Division::count() === 0) {
        \App\Models\Division::factory()->create();
    }
});

test('requester cannot approve their own reimbursement', function () {
    $user = User::factory()->create();
    $user->assignRole('head');
    
    $project = Project::factory()->create([
        'head_id' => $user->id,
        'created_by' => $user->id,
        'account_manager_id' => $user->id,
        'pic_id' => $user->id,
    ]);
    $reimbursement = Reimbursement::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'status' => ReimbursementStatus::Submitted,
    ]);

    $this->actingAs($user);
    
    $response = $this->getJson("/api/v1/reimbursements/{$reimbursement->code}");
    
    $response->assertStatus(200)
        ->assertJsonPath('data.can_approve', false);
});

test('project head can approve submitted reimbursement', function () {
    $head = User::factory()->create();
    $head->assignRole('head');
    
    $requester = User::factory()->create();
    
    $project = Project::factory()->create([
        'head_id' => $head->id,
        'created_by' => $head->id,
        'account_manager_id' => $head->id,
        'pic_id' => $head->id,
    ]);
    $reimbursement = Reimbursement::factory()->create([
        'user_id' => $requester->id,
        'project_id' => $project->id,
        'status' => ReimbursementStatus::Submitted,
    ]);

    $this->actingAs($head);
    
    $response = $this->getJson("/api/v1/reimbursements/{$reimbursement->code}");
    
    $response->assertStatus(200)
        ->assertJsonPath('data.can_approve', true);
});

test('finance can approve head_approved reimbursement', function () {
    $finance = User::factory()->create();
    $finance->assignRole('finance');
    
    $requester = User::factory()->create();
    
    $project = Project::factory()->create([
        'head_id' => $finance->id,
        'created_by' => $finance->id,
        'account_manager_id' => $finance->id,
        'pic_id' => $finance->id,
    ]);

    $reimbursement = Reimbursement::factory()->create([
        'user_id' => $requester->id,
        'project_id' => $project->id,
        'status' => ReimbursementStatus::HeadApproved,
    ]);

    $this->actingAs($finance);
    
    $response = $this->getJson("/api/v1/reimbursements/{$reimbursement->code}");
    
    $response->assertStatus(200)
        ->assertJsonPath('data.can_approve', true);
});

test('user cannot approve twice', function () {
    $head = User::factory()->create();
    $head->assignRole('head');
    
    $requester = User::factory()->create();
    
    $project = Project::factory()->create([
        'head_id' => $head->id,
        'created_by' => $head->id,
        'account_manager_id' => $head->id,
        'pic_id' => $head->id,
    ]);
    $reimbursement = Reimbursement::factory()->create([
        'user_id' => $requester->id,
        'project_id' => $project->id,
        'status' => ReimbursementStatus::Submitted,
    ]);

    // Simulate approval
    $reimbursement->approvals()->create([
        'approver_id' => $head->id,
        'role' => 'head',
        'status' => 'approved',
        'approved_at' => now(),
    ]);

    $this->actingAs($head);
    
    $response = $this->getJson("/api/v1/reimbursements/{$reimbursement->code}");
    
    $response->assertStatus(200)
        ->assertJsonPath('data.can_approve', false);
});
