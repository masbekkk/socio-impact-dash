<?php

declare(strict_types=1);

namespace App\Providers;

use App\Enums\UserRole;
use App\Models\ProjectEvent;
use App\Policies\ProjectEventPolicy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

final class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->bootModelsDefaults();
        $this->bootPasswordDefaults();
        $this->bootGates();
    }

    private function bootModelsDefaults(): void
    {
        Model::unguard();
    }

    private function bootPasswordDefaults(): void
    {
        Password::defaults(fn () => app()->isLocal() || app()->runningUnitTests() ? Password::min(12)->max(255) : Password::min(12)->max(255)->uncompromised());
    }

    private function bootGates(): void
    {
        Gate::define('adminAccess', fn (\App\Models\User $user): bool => $user->hasRole(UserRole::Superadmin->value));
        Gate::define('view-admin', fn (\App\Models\User $user): bool => $user->hasRole(UserRole::Superadmin->value));
        Gate::policy(ProjectEvent::class, ProjectEventPolicy::class);
    }
}
