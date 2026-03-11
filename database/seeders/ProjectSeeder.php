<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

final class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\Project::factory()->count(25)->create()->each(function (\App\Models\Project $project): void {
            $project->locations()->createMany([
                ['latitude' => '-6.200000', 'longitude' => '106.816666', 'detail_address' => 'Jakarta Office'],
                ['latitude' => '-7.257472', 'longitude' => '112.752088', 'detail_address' => 'Surabaya Branch'],
            ]);

            $project->monitorings()->create([
                'created_by' => $project->created_by,
                'report_date' => $project->start_date?->addDays(15) ?? now()->addDays(15),
                'notes' => 'Progress report for the first two weeks.',
            ]);

            $budgetTotal = (float) $project->budget_total;

            $project->terminPayments()->createMany([
                [
                    'nominal' => $budgetTotal * 0.3,
                    'due_date' => $project->start_date,
                    'notes' => 'Down payment',
                    'verified_by' => $project->head_id,
                    'proof_payment' => null,
                ],
                [
                    'nominal' => $budgetTotal * 0.7,
                    'due_date' => $project->end_date,
                    'notes' => 'Final payment',
                    'verified_by' => $project->head_id,
                    'proof_payment' => null,
                ],
            ]);
        });
    }
}
