<?php

namespace App\Providers;

use App\Http\Controllers\Modules\System\SystemSettingsController;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
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

        SystemSettingsController::applyMailConfig();

        if ($appName = Cache::get('app_name')) {
            config(['app.name' => $appName]);
        }
    }
}

