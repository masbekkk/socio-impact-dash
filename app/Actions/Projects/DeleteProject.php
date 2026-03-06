<?php

declare(strict_types=1);

namespace App\Actions\Projects;

use App\Models\Project;
use Illuminate\Support\Facades\DB;

final class DeleteProject
{
    public function handle(Project $project): bool
    {
        return DB::transaction(function () use ($project) {
            // Since we use SoftDeletes, this will just mark the project as deleted.
            // We might want to handle cleaning up related files if it's a force delete,
            // but for standard delete we just soft delete.
            return $project->delete();
        });
    }
}
