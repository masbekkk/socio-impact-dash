<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\LeaveStatus;
use App\Enums\PresenceStatus;
use App\Enums\ProjectStatus;
use App\Enums\ReimbursementStatus;
use App\Enums\UserRole;
use App\Models\Leave;
use App\Models\LetterRequest;
use App\Models\Presence;
use App\Models\Project;
use App\Models\Reimbursement;
use App\Models\User;
use Database\Seeders\DemoDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class DemoDataSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_data_seeder_creates_complete_demo_dataset(): void
    {
        $this->seed(DemoDataSeeder::class);

        foreach (UserRole::cases() as $role) {
            $this->assertTrue(User::role($role->value)->exists(), "Missing demo user for {$role->value}");
        }

        $this->assertGreaterThanOrEqual(10, Project::query()->count());
        $this->assertTrue(Project::query()->where('status', ProjectStatus::Active)->exists());
        $this->assertTrue(Project::query()->where('status', ProjectStatus::Finished)->exists());
        $this->assertTrue(Project::query()->whereHas('budgetDetails')->whereHas('locations')->whereHas('terminPayments')->exists());

        foreach ([ReimbursementStatus::Submitted, ReimbursementStatus::HeadApproved, ReimbursementStatus::FinanceApproved, ReimbursementStatus::Transferred, ReimbursementStatus::Revision, ReimbursementStatus::Rejected] as $status) {
            $this->assertTrue(Reimbursement::query()->where('status', $status)->exists(), "Missing reimbursement status {$status->value}");
        }

        $this->assertTrue(Reimbursement::query()->where('type', 'atr')->whereHas('eers')->exists());
        $this->assertTrue(Reimbursement::query()->where('type', 'allowance')->exists());
        $this->assertTrue(Leave::query()->whereIn('status', [LeaveStatus::Submitted, LeaveStatus::HeadApproved, LeaveStatus::HRApproved, LeaveStatus::Revision, LeaveStatus::Rejected])->exists());
        $this->assertTrue(Presence::query()->whereIn('status', [PresenceStatus::CheckedIn, PresenceStatus::Late, PresenceStatus::WorkFromHome])->exists());
        $this->assertTrue(LetterRequest::query()->whereNotNull('letter_number')->exists());
    }
}
