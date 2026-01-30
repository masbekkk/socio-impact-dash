<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Project;

final readonly class FinishProject
{
    public function handle(Project $project): bool
    {
        return $project->update(['status' => 'finished']);
    }
}
