<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

final readonly class ImpersonateUser
{
    public function handle(User $user): void
    {
        $originalId = Auth::id();

        Session::put('impersonated_by', $originalId);

        Auth::guard('web')->loginUsingId($user->id);
        Session::put('password_hash_web', $user->getAuthPassword());
        Session::regenerate();
    }
}
