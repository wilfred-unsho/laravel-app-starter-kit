<?php

namespace App\Providers;

use App\Listeners\LogFailedLogin;
use App\Listeners\LogSuccessfulLogin;
use App\Services\AdminMenuService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

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
        Vite::prefetch(concurrency: 3);

        Inertia::share([
            'menu_items' => fn () => Auth::check()
                ? app(AdminMenuService::class)->getVisibleMenuItems()
                : [],
        ]);

//        $lifetime = \App\Models\SecuritySetting::get('session_lifetime', 120);
//        config(['session.lifetime' => $lifetime]);

        //Event::listen(listener: [LogSuccessfulLogin::class, LogFailedLogin::class,], events: [null]);
    }
}
