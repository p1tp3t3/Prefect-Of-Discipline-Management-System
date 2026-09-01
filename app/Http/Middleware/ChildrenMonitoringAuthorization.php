<?php

namespace App\Http\Middleware;

use App\Models\Family;
use App\Models\FamilyMember;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ChildrenMonitoringAuthorization
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $parent = auth()->user()->role == 'parent';
        //$childrenMonitoring = FamilyMember::whereIn('member_id', auth()->user()->id);
        return $next($request);
    }
}
