<?php

declare(strict_types=1);

namespace App\Actions\Projects;

use App\Models\Project;
use App\Models\ProjectApproval;
use Illuminate\Support\Facades\DB;

final class RejectProject
{
    public function handle(Project $project, int $userId, ?string $notes = null): Project
    {
        return DB::transaction(function () use ($project, $userId, $notes) {
            // Create rejection record
            ProjectApproval::query()->create([
                'project_id' => $project->id,
                'approved_by' => $userId,
                'approval_type' => 'rejection', // or 'revision' as per frontend "Minta Revisi"
                'approval_status' => 'rejected',
                'notes' => $notes,
            ]);

            // Update project status to DRAFT or REVISION if needed
            $project->update(['status' => 'draft']);

            return $project->refresh();
        });
    }
}
