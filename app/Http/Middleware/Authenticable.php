<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

class Authenticable
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        if(!auth()->check()) {
            $referer = $request->headers->get('referer');

            if ($referer && parse_url($referer, PHP_URL_HOST) === $request->getHost()) {
                $path = parse_url($referer, PHP_URL_PATH) ?? '/';
                $query = parse_url($referer, PHP_URL_QUERY);

                session(['url.intended' => $query ? "{$path}?{$query}" : $path]);
            }

            return Inertia::location(route('type.user'));
        }
        return $next($request);
    }
}
