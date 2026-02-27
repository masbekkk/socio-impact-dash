<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

final class UserService
{
    public static function loggedUser(): ?User
    {
        $cachedUser = null;

        if ($cachedUser === null) {
            $cachedUser = User::with('roles')->find(Auth::id());
            $cachedUser->role_name = $cachedUser->getRoleNames()->implode(', ');
        }

        return $cachedUser;
    }
}
