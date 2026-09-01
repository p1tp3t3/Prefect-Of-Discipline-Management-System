<?php

namespace App\Http\Middleware;

use App\Models\EducationBackground;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ProfileUpdateAuthorization
{
    public function handle(Request $request, Closure $next): Response
    {
        if(!self::hasAnyProfileData() || auth()->user()->user_type == 'itrc' || auth()->user()->user_type == 'prefect') {
            return $next($request);
        }
        return Inertia::location("/");
    }

    private function hasAnyProfileData(): bool
    {
        $user = auth()->user();

        if (! $user) {
            return false;
        }

        if ($user->user_type === 'student') {
            $fields = [
                'profile_picture',
                'date_of_birth',
                'citizenship',
                'religion',
                'place_of_birth',
            ];

            foreach ($fields as $field) {
                if (! is_null($user->{$field}) && trim((string) $user->{$field}) != '') {
                    return true;
                }
            }

            // ✅ Address check (if changed from placeholder, we count it as progress)
            if (
                !empty($user->current_address) && $user->current_address != 'place,city,province,zipcode' ||
                !empty($user->permanent_address) && $user->permanent_address != 'place,city,province,zipcode'
            ) {
                return true;
            }

            return false; // 🚨 totally blank
        }

        return false;
    }
}
