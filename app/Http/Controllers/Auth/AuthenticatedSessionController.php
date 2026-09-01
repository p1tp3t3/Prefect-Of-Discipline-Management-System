<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\ActionLog;
use App\Models\WebPushSubscription;
use Illuminate\Container\Attributes\Cache;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create()
    {
        $password = Hash::make('password');
        if(auth()->check()) return Inertia::location('/dashboard');
        return Inertia::render('login', ['password' => $password]);
    }
    public function gatepassLogin()
    {
        if(auth()->check()) return back()->withErrors(['message' => 'you are log in already']);
        return Inertia::render('gatepass-login');
    }

    /**
     * The bcrypt hash guarding /super-admin/login/{password}. Super admins can
     * change this from System Settings; falls back to the .env-configured
     * value until they do.
     */
    private static function maintenanceLoginSecret()
    {
        return \Illuminate\Support\Facades\Cache::get('maintenance_login_secret')
            ?? config('app.maintenance_login_secret');
    }

    /**
     * Display the super-admin login form used to bypass maintenance mode.
     */
    public function maintenanceLoginCreate($password)
    {
        if (! Hash::check($password, self::maintenanceLoginSecret())) {
            abort(404);
        }

        if (auth()->check()) {
            return Inertia::location('/dashboard');
        }

        return Inertia::render('super-admin-login', ['password' => $password]);
    }

    /**
     * Handle a super-admin login attempt made while maintenance mode is active.
     */
    public function maintenanceLoginStore($password, LoginRequest $request)
    {
        if (! Hash::check($password, self::maintenanceLoginSecret())) {
            abort(404);
        }

        try {
            $user = $request->authenticate();
        } catch (ValidationException $e) {
            return response()->json(
                array_map(fn ($messages) => $messages[0], $e->errors()),
                400
            );
        }

        if ($user->role !== 'super_admin') {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'username' => 'Only super admin accounts can access the system during maintenance.',
            ], 403);
        }

        return self::startSession($request, $user);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        try {
            $user = $request->authenticate();
        } catch (ValidationException $e) {
            return response()->json(
                array_map(fn ($messages) => $messages[0], $e->errors()),
                400
            );
        }

        return self::startSession($request, $user);
    }
    private function startSession($request, $user) 
    {        
        if ($user->activate) {
            $intended = $request->session()->pull('url.intended');
            $request->session()->regenerate();
            ActionLog::create([
                'user_id' =>  $user->id,
                'action_type' => 'login',
                'details' => 'logs in to the system'
            ]);
            return Inertia::location($intended ?: route('auth.dashboard'));
        }
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    
        return response()->json(['username' => 'This account has been deactivated.'], 400);
    }


    public function destroy(Request $request)
    {
        $user = auth()->user();

        // Get the stored endpoint (only this device)
        $endpoint = session('webpush_endpoint');

        if ($user && $endpoint) {

            // Delete WebPush subscription ONLY for this browser
            WebPushSubscription::where('endpoint', $endpoint)->delete();

            // Remove session key
            session()->forget('webpush_endpoint');
        }

        // Log user action
        ActionLog::create([
            'user_id' => $user->id,
            'action_type' => 'logout',
            'details' => 'logs out of the system'
        ]);

        // Destroy session and regenerate token
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Inertia::location(route("type.user"));

    }
}
