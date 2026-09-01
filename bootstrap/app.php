<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\CheckMaintenanceMode::class,
        ]);

        $middleware->alias([
            'activate' => \App\Http\Middleware\Activation::class,
            'user-activity' => \App\Http\Middleware\UserActivity::class,
            'auth' => \App\Http\Middleware\Authenticable::class,
            'profile-authorized' => \App\Http\Middleware\ProfileAuthorization::class,
            'profile-edit-authorized' => \App\Http\Middleware\ProfileUpdateAuthorization::class,
            'children-monitoring-authorized' => \App\Http\Middleware\ChildrenMonitoringAuthorization::class,

            'role' => \App\Http\Middleware\RoleAuthenticable::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
