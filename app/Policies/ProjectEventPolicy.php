<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\ProjectEvent;
use App\Models\User;

final class ProjectEventPolicy
{
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_event');
    }

    public function delete(User $user, ProjectEvent $projectEvent): bool
    {
        if ($user->hasRole(UserRole::Superadmin->value)) {
            return true;
        }

        return (int) $user->id === (int) $projectEvent->created_by && $user->hasPermissionTo('delete_event');
    }
}
