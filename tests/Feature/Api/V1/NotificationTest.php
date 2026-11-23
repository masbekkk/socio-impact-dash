<?php

declare(strict_types=1);

use App\Models\Leave;
use App\Models\Notification;
use App\Models\Project;
use App\Models\ProjectEvent;
use App\Models\Reimbursement;
use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function (): void {
    foreach (['pegawai', 'head', 'finance', 'direktur', 'hr', 'superadmin'] as $role) {
        Role::query()->firstOrCreate(['name' => $role, 'guard_name' => 'web']);
    }
});

test('notifications index returns resolved urls for all reference types including reimbursements and calendar events', function (): void {
    $user = User::factory()->create();

    $reimbursement = Reimbursement::factory()->create();
    $project = Project::factory()->create();
    $leave = Leave::factory()->create();
    $letterRequestId = 123;
    $event = ProjectEvent::factory()->create([
        'start_date' => '2026-12-25',
    ]);

    // 1. Reimbursement with string 'reimbursement'
    $n1 = Notification::query()->create([
        'type' => 'reimbursement_approved',
        'title' => 'Reimbursement Approved',
        'message' => 'Approved',
        'reference_type' => 'reimbursement',
        'reference_id' => $reimbursement->id,
    ]);
    $n1->recipients()->create(['user_id' => $user->id, 'channel' => 'in_app', 'status' => 'sent', 'sent_at' => now()]);

    // 2. Reimbursement with class name App\Models\Reimbursement
    $n2 = Notification::query()->create([
        'type' => 'reimbursement_created',
        'title' => 'Reimbursement Created',
        'message' => 'Created',
        'reference_type' => Reimbursement::class,
        'reference_id' => $reimbursement->id,
    ]);
    $n2->recipients()->create(['user_id' => $user->id, 'channel' => 'in_app', 'status' => 'sent', 'sent_at' => now()]);

    // 3. Project
    $n3 = Notification::query()->create([
        'type' => 'project_created',
        'title' => 'Project Created',
        'message' => 'New Project',
        'reference_type' => 'project',
        'reference_id' => $project->id,
    ]);
    $n3->recipients()->create(['user_id' => $user->id, 'channel' => 'in_app', 'status' => 'sent', 'sent_at' => now()]);

    // 4. Leave
    $n4 = Notification::query()->create([
        'type' => 'leave_revised',
        'title' => 'Leave Revised',
        'message' => 'Leave revised',
        'reference_type' => 'leave',
        'reference_id' => $leave->id,
    ]);
    $n4->recipients()->create(['user_id' => $user->id, 'channel' => 'in_app', 'status' => 'sent', 'sent_at' => now()]);

    // 5. Letter request
    $n5 = Notification::query()->create([
        'type' => 'letter_request_submitted',
        'title' => 'Letter Request',
        'message' => 'Letter submitted',
        'reference_type' => 'letter_request',
        'reference_id' => $letterRequestId,
    ]);
    $n5->recipients()->create(['user_id' => $user->id, 'channel' => 'in_app', 'status' => 'sent', 'sent_at' => now()]);

    // 6. Project Event / Calendar with date
    $n6 = Notification::query()->create([
        'type' => 'calendar_event_invited',
        'title' => 'Agenda Baru',
        'message' => 'Undangan agenda',
        'reference_type' => 'project_event',
        'reference_id' => $event->id,
    ]);
    $n6->recipients()->create(['user_id' => $user->id, 'channel' => 'in_app', 'status' => 'sent', 'sent_at' => now()]);

    // 7. Calendar without event ID
    $n7 = Notification::query()->create([
        'type' => 'calendar_general',
        'title' => 'Kalender Umum',
        'message' => 'Jadwal umum',
        'reference_type' => 'calendar',
        'reference_id' => null,
    ]);
    $n7->recipients()->create(['user_id' => $user->id, 'channel' => 'in_app', 'status' => 'sent', 'sent_at' => now()]);

    $response = $this->actingAs($user)->getJson('/api/v1/notifications');

    $response->assertOk();
    $data = collect($response->json('data.data') ?? $response->json('data'));

    expect($data->firstWhere('type', 'reimbursement_approved')['url'])->toBe("/reimbursements/{$reimbursement->id}")
        ->and($data->firstWhere('type', 'reimbursement_created')['url'])->toBe("/reimbursements/{$reimbursement->id}")
        ->and($data->firstWhere('type', 'project_created')['url'])->toBe("/projects/{$project->uuid}")
        ->and($data->firstWhere('type', 'leave_revised')['url'])->toBe("/leaves/{$leave->id}")
        ->and($data->firstWhere('type', 'letter_request_submitted')['url'])->toBe("/letter-requests/{$letterRequestId}")
        ->and($data->firstWhere('type', 'calendar_event_invited')['url'])->toBe('/calendar?date=2026-12-25')
        ->and($data->firstWhere('type', 'calendar_general')['url'])->toBe('/calendar');
});

test('notification unread count and mark as read work correctly', function (): void {
    $user = User::factory()->create();

    $notification = Notification::query()->create([
        'type' => 'calendar_event_invited',
        'title' => 'Agenda Baru',
        'message' => 'Undangan agenda',
        'reference_type' => 'project_event',
        'reference_id' => null,
    ]);

    $recipient = $notification->recipients()->create([
        'user_id' => $user->id,
        'channel' => 'in_app',
        'status' => 'sent',
        'sent_at' => now(),
    ]);

    $countRes = $this->actingAs($user)->getJson('/api/v1/notifications/unread-count');
    $countRes->assertOk()->assertJsonPath('data.count', 1);

    $readRes = $this->actingAs($user)->postJson("/api/v1/notifications/{$recipient->id}/read");
    $readRes->assertOk();

    expect($recipient->fresh()->read_at)->not->toBeNull()
        ->and($recipient->fresh()->status)->toBe('read');

    $countResAfter = $this->actingAs($user)->getJson('/api/v1/notifications/unread-count');
    $countResAfter->assertOk()->assertJsonPath('data.count', 0);
});
