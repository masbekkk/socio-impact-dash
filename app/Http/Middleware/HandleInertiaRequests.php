<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Middleware;

final class HandleInertiaRequests extends Middleware
{
    /**
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => Auth::check() ? UserService::loggedUser() : null,
                'permissions' => Auth::check() ? Auth::user()->getPermissionsViaRoles()->pluck('name') : [],
                'is_impersonating' => Session::has('impersonated_by'),
                'original_user' => Session::has('impersonated_by') ? \App\Models\User::query()->find(Session::get('impersonated_by'))?->name : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
