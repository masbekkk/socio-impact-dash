<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\ApprovalRole;
use App\Enums\ApprovalStatus;
use App\Enums\LeaveStatus;
use App\Enums\LeaveType;
use App\Models\Leave;
use App\Models\LeaveApproval;
use App\Models\User;
use Illuminate\Database\Seeder;

final class LeaveSeeder extends Seeder
{
    public function run(): void
    {
        $employees = User::query()->role('pegawai')->get();
        $head = User::query()->role('head')->first();
        $hr = User::query()->role('hr')->first();
        $admin = User::query()->role('superadmin')->first();

        $leaveTypes = [
            LeaveType::Annual,
            LeaveType::Sick,
            LeaveType::Important,
        ];

        $approverMap = [
            ['approver' => $head,  'role' => ApprovalRole::Head,    'leaveStatus' => LeaveStatus::HeadApproved],
            ['approver' => $hr,    'role' => ApprovalRole::HR,      'leaveStatus' => LeaveStatus::HRApproved],
            ['approver' => $admin, 'role' => ApprovalRole::SuperAdmin, 'leaveStatus' => LeaveStatus::SuperAdminApproved],
        ];

        $statuses = [
            LeaveStatus::Submitted,
            LeaveStatus::HeadApproved,
            LeaveStatus::HRApproved,
            LeaveStatus::SuperAdminApproved,
            LeaveStatus::Rejected,
        ];

        $year = now()->year;
        $counter = Leave::query()->whereYear('created_at', $year)->count() + 1;

        for ($i = 1; $i <= 20; $i++) {
            $employee = $employees->random();
            $type = $leaveTypes[array_rand($leaveTypes)];
            $startDate = \Illuminate\Support\Facades\Date::now()->subDays(random_int(5, 90))->startOfDay();
            $endDate = (clone $startDate)->addDays(random_int(1, 7));
            $status = $statuses[array_rand($statuses)];

            $code = sprintf('LV-%d-%03d', $year, $counter++);

            $leave = Leave::query()->create([
                'code' => $code,
                'user_id' => $employee->id,
                'type' => $type,
                'status' => $status,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'reason' => $this->randomReason($type),
                'phone' => '08'.random_int(100000000, 999999999),
            ]);

            // Only create approval if not in draft/submitted
            if (! in_array($status, [LeaveStatus::Submitted, LeaveStatus::Draft], true)) {
                $map = $approverMap[array_rand($approverMap)];

                LeaveApproval::query()->create([
                    'leave_id' => $leave->id,
                    'approver_id' => $map['approver']->id,
                    'role' => $map['role'],
                    'status' => $status === LeaveStatus::Rejected
                        ? ApprovalStatus::Rejected
                        : ApprovalStatus::Approved,
                    'notes' => $status === LeaveStatus::Rejected
                        ? 'Pengajuan tidak memenuhi syarat.'
                        : null,
                    'approved_at' => \Illuminate\Support\Facades\Date::now()->subDays(random_int(1, 5)),
                ]);
            }
        }
    }

    private function randomReason(LeaveType $type): string
    {
        return match ($type) {
            LeaveType::Annual => fake()->randomElement([
                'Liburan keluarga ke luar kota.',
                'Keperluan pribadi.',
                'Istirahat tahunan.',
            ]),
            LeaveType::Sick => fake()->randomElement([
                'Demam dan flu.',
                'Sakit kepala berkepanjangan.',
                'Perlu istirahat atas anjuran dokter.',
            ]),
            LeaveType::Important => fake()->randomElement([
                'Menghadiri pernikahan saudara.',
                'Urusan keluarga mendesak.',
                'Keperluan administratif penting.',
            ]),
            default => 'Cuti rutin.',
        };
    }
}
