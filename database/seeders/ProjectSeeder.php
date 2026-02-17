<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

final class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\Project::factory()->count(25)->create()->each(function (\App\Models\Project $project) {
            // Create some locations
            $project->locations()->createMany([
                ['latitude' => -6.2, 'longitude' => 106.8, 'detail_address' => 'Jakarta Office'],
                ['latitude' => -7.2, 'longitude' => 112.7, 'detail_address' => 'Surabaya Branch'],
            ]);

            // Create some monitorings
            $project->monitorings()->createMany([
                [
                    'created_by' => $project->user_id,
                    'report_date' => $project->start_date->addDays(15),
                    'notes' => 'Progress report for the first two weeks.',
                ],
            ]);

            // Create some termin payments
            $project->terminPayments()->createMany([
                [
                    'nominal' => $project->budget_total * 0.3,
                    'due_date' => $project->start_date,
                    'notes' => 'Down payment',
                    'verified_by' => $project->head_id,
                ],
                [
                    'nominal' => $project->budget_total * 0.7,
                    'due_date' => $project->end_date,
                    'notes' => 'Final payment',
                    'verified_by' => $project->head_id,
                ],
            ]);
        });
    }
}
