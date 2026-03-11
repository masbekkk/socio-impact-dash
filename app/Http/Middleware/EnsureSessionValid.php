<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

final class EnsureSessionValid
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->session()->has('impersonated_by') && Auth::guard('web')->check()) {
            $user = Auth::guard('web')->user();
            // Ensure the password_hash_web is always set to the current user's password
            // when impersonating to prevent AuthenticateSession middleware from logging them out.
            if ($user) {
                $request->session()->put('password_hash_web', $user->getAuthPassword());
            }
        }

        return $next($request);
    }
}
