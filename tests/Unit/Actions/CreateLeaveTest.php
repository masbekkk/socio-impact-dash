<?php

declare(strict_types=1);

use App\Actions\CreateLeave;
use App\Enums\LeaveStatus;
use App\Enums\LeaveType;
use App\Models\User;
use App\Services\FileUploadService;
use App\Services\LeaveService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->artisan('db:seed', ['--class' => 'RoleAndPermissionSeeder']);
    $this->leaveService = resolve(LeaveService::class);
    $this->fileUploadService = resolve(FileUploadService::class);
    $this->action = new CreateLeave($this->fileUploadService, $this->leaveService);
});

it('creates a leave and assigns correct approvers for pegawai', function (): void {
    $head = User::factory()->create()->assignRole('head');
    User::factory()->create(['email' => 'hr@socio-impact.test'])->assignRole('hr');
    User::factory()->create(['email' => 'direktur@socio-impact.test'])->assignRole('direktur');
    $user = User::factory()->create()->assignRole('pegawai');
    $replacement = User::factory()->create();

    $leave = $this->action->handle([
        'type' => current(LeaveType::cases())->value,
        'start_date' => Illuminate\Support\Facades\Date::now()->addDays(1)->format('Y-m-d'),
        'end_date' => Illuminate\Support\Facades\Date::now()->addDays(3)->format('Y-m-d'),
        'replacement_pic_id' => $replacement->id,
        'approver_head_id' => $head->id,
        'phone' => '081234',
        'lokasi' => 'Bandung',
    ], $user->id);

    expect($leave)->toBeInstanceOf(App\Models\Leave::class)
        ->and($leave->status)->toBe(LeaveStatus::Submitted)
        ->and($leave->approvals)->toHaveCount(3);
});

it('prevents creating annual leave if quota exceeded', function (): void {
    $user = User::factory()->create()->assignRole('pegawai');
    $head = User::factory()->create()->assignRole('head');

    // Simulate all quota used by creating a previous leave
    $start = Illuminate\Support\Facades\Date::now()->startOfYear()->addDays(10);
    $end = clone $start;
    $end->addDays(20); // More than 12 weekdays almost certainly

    App\Models\Leave::factory()->create([
        'user_id' => $user->id,
        'type' => LeaveType::Annual,
        'status' => LeaveStatus::HRApproved,
        'start_date' => $start->format('Y-m-d'),
        'end_date' => $end->format('Y-m-d'),
    ]);

    $this->action->handle([
        'type' => 'annual',
        'start_date' => Illuminate\Support\Facades\Date::now()->next(Carbon::MONDAY)->format('Y-m-d'), // Mon
        'end_date' => Illuminate\Support\Facades\Date::now()->next(Carbon::MONDAY)->addDays(1)->format('Y-m-d'), // Tue, 2 days
        'replacement_pic_id' => $user->id,
        'approver_head_id' => $head->id,
        'phone' => '081234',
        'lokasi' => 'Bandung',
    ], $user->id);
})->throws(ValidationException::class);
