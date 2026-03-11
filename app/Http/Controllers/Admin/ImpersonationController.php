<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\ImpersonateUser;
use App\Actions\StopImpersonating;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;

final class ImpersonationController extends Controller
{
    public function impersonate(User $user, ImpersonateUser $action): RedirectResponse
    {
        $action->handle($user);

        return to_route('dashboard');
    }

    public function stop(StopImpersonating $action): RedirectResponse
    {
        $action->handle();

        return to_route('users.index');
    }
}
