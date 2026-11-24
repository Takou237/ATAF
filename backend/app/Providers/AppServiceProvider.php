<?php

namespace App\Providers;

use App\Models\User;
use App\Policies\RolePolicy;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Spatie\Permission\Models\Role;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->environment('production') || str_starts_with((string) config('app.url'), 'https://')) {
            URL::forceScheme('https');
        }

        Gate::before(function (User $user, string $ability) {
            return $user->hasRole('super-admin') ? true : null;
        });

        // Le modèle Role vient de Spatie : la découverte automatique
        // App\Models\X -> App\Policies\XPolicy ne le trouve pas.
        Gate::policy(Role::class, RolePolicy::class);

        ResetPassword::createUrlUsing(function (User $user, string $token) {
            $frontend = rtrim((string) config('app.frontend_url'), '/');

            return $frontend.'/espace-membres/reinitialiser?token='.urlencode($token).'&email='.urlencode($user->email);
        });
    }
}
