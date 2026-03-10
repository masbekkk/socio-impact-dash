<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

final readonly class StopImpersonating
{
    public function handle(): void
    {
        $originalId = Session::pull('impersonated_by');

        if ($originalId) {
            $user = User::find($originalId);
            if ($user) {
                Auth::guard('web')->loginUsingId($user->id);
                Session::put('password_hash_web', $user->getAuthPassword());
            }
        }

        Session::regenerate();
    }
}
