<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\ProjectHealth;
use App\Enums\ProjectStatus;
use App\Enums\ProjectType;
use App\Enums\SubmissionType;
use App\Enums\ReminderType;
use App\Models\Division;
use App\Models\Project;
use App\Models\ProjectSubmission;
use App\Models\Reminder;
use App\Models\User;
use Illuminate\Database\Seeder;

final class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $division = Division::first();
        $user = User::where('email', 'pegawai1@socio-impact.test')->first() ?? User::first();
        $head = User::where('email', 'head@socio-impact.test')->first() ?? User::first();

        if (! $division || ! $user) {
            return;
        }

        $projects = [
            [
                'code' => 'PRJ-2026-0001',
                'name' => 'Proyek Pendampingan Desa Digital',
                'client' => 'Kemendes PDTT',
                'project_type' => ProjectType::Pendampingan->value,
                'status' => ProjectStatus::Active->value,
                'health' => ProjectHealth::Sehat->value,
                'region' => 'Jawa Barat',
                'spk_start_date' => now()->subMonths(2),
                'spk_end_date' => now()->addMonths(4),
                'budget_total' => 150_000_000,
                'nominal_planned' => 150_000_000,
            ],
            [
                'code' => 'PRJ-2026-0002',
                'name' => 'Pelatihan Dasar Digital Marketing',
                'client' => 'Dinas Kominfo',
                'project_type' => ProjectType::Pelatihan->value,
                'status' => ProjectStatus::OnTrack->value,
                'health' => ProjectHealth::Waspada->value,
                'region' => 'DKI Jakarta',
                'spk_start_date' => now()->subMonth(),
                'spk_end_date' => now()->addMonths(2),
                'budget_total' => 80_000_000,
                'nominal_planned' => 80_000_000,
            ],
            [
                'code' => 'PRJ-2026-0003',
                'name' => 'Event Seminar Nasional Inovasi',
                'client' => 'Kemenristek',
                'project_type' => ProjectType::Event->value,
                'status' => ProjectStatus::AtRisk->value,
                'health' => ProjectHealth::Kritis->value,
                'region' => 'Banten',
                'spk_start_date' => now()->subMonths(3),
                'spk_end_date' => now()->addMonth(),
                'budget_total' => 200_000_000,
                'nominal_planned' => 200_000_000,
            ],
        ];

        foreach ($projects as $i => $data) {
            $project = Project::firstOrCreate(
                ['code' => $data['code']],
                [
                    'name' => $data['name'],
                    'client' => $data['client'],
                    'description' => null,
                    'user_id' => $user->id,
                    'division_id' => $division->id,
                    'account_manager_id' => $user->id,
                    'head_id' => $head->id,
                    'pic_id' => $user->id,
                    'project_type' => $data['project_type'],
                    'status' => $data['status'],
                    'health' => $data['health'],
                    'region' => $data['region'],
                    'sow' => null,
                    'budget_total' => $data['budget_total'],
                    'nominal_planned' => $data['nominal_planned'],
                    'spk_start_date' => $data['spk_start_date'],
                    'spk_end_date' => $data['spk_end_date'],
                ]
            );

            if ($project->wasRecentlyCreated) {
                ProjectSubmission::firstOrCreate(
                    [
                        'project_id' => $project->id,
                        'type' => SubmissionType::Initial->value,
                        'year' => null,
                        'month' => null,
                    ],
                    [
                        'kendala' => null,
                        'submitted_by' => $user->id,
                    ]
                );

                if ($i === 0) {
                    ProjectSubmission::firstOrCreate(
                        [
                            'project_id' => $project->id,
                            'type' => SubmissionType::Monthly->value,
                            'year' => (int) now()->format('Y'),
                            'month' => (int) now()->format('n'),
                        ],
                        [
                            'kendala' => 'Progress sesuai rencana.',
                            'status' => ProjectStatus::OnTrack->value,
                            'submitted_by' => $user->id,
                        ]
                    );
                }

                Reminder::firstOrCreate(
                    [
                        'project_id' => $project->id,
                        'type' => ReminderType::MonitoringReminder->value,
                        'due_at' => now()->endOfMonth(),
                    ],
                    [
                        'title' => 'Monitoring bulanan ' . $project->name,
                        'message' => 'Silakan submit laporan monitoring untuk bulan ini.',
                        'created_by' => $user->id,
                    ]
                );
            }
        }
    }
}
