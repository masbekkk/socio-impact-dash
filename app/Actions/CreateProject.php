<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\ProjectStatus;
use App\Enums\ProjectType;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

final readonly class CreateProject
{
    public function handle(array $data): Project
    {
        return DB::transaction(function () use ($data) {
            $project = Project::create([
                'code' => 'PRJ-'.mb_strtoupper(uniqid()),
                'name' => $data['name'],
                'client' => $data['client'],
                'description' => $data['description'] ?? null,
                'user_id' => Auth::id(),
                'division_id' => $data['division_id'] ?? null,
                'account_manager_id' => $data['account_manager_id'] ?? null,
                'head_id' => $data['head_id'] ?? null,
                'pic_id' => $data['pic_id'] ?? null,
                'status' => ProjectStatus::Draft,
                'project_type' => $data['project_type'] ?? ProjectType::Pendampingan->value,
                'sow' => $data['sow'] ?? null,
                'budget_total' => $data['budget_total'] ?? 0,
            ]);

            if (isset($data['budgets'])) {
                foreach ($data['budgets'] as $budget) {
                    $project->budgets()->create($budget);
                }
            }

            if (isset($data['milestones'])) {
                foreach ($data['milestones'] as $milestone) {
                    $project->milestones()->create($milestone);
                }
            }

            return $project;
        });
    }
}
