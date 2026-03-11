<?php

declare(strict_types=1);

namespace App\Actions\Projects;

use App\Models\Project;
use App\Models\ProjectApproval;
use Illuminate\Support\Facades\DB;

final class ApproveProject
{
    public function handle(Project $project, int $userId, ?string $notes = null): Project
    {
        return DB::transaction(function () use ($project, $userId, $notes) {
            // Create approval record
            ProjectApproval::query()->create([
                'project_id' => $project->id,
                'approved_by' => $userId,
                'approval_type' => 'approval',
                'approval_status' => 'approved',
                'notes' => $notes,
            ]);

            // Update project status if needed based on business logic
            // For now, let's assume if it's approved, it might move to a new status or just be recorded.
            // If strict workflow (Admin -> Finance -> Director), we might check roles.
            // But for simplicity based on current request, we just record approval.

            // If the user is a Director (Head) or per business rule, we might update project status.
            // For now, let's keep it simple: record the approval.

            return $project->refresh();
        });
    }
}
