<?php

namespace App\Http\Controllers\Modules\System;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class SystemSettingsController extends Controller
{
    public function index()
    {
        $mailConfig = Cache::get('mail_config');

        return Inertia::render('itrc/system-settings', [
            'user' => auth()->user(),
            'has_login_portal_password' => Cache::has('maintenance_login_secret')
                || !empty(config('app.maintenance_login_secret')),
            'mail_config' => $mailConfig ? [
                'username' => $mailConfig['username'] ?? '',
                'has_password' => !empty($mailConfig['password'] ?? null),
            ] : null,
            'app_name' => Cache::get('app_name', config('app.name')),
        ]);
    }

    public function updateAppName(Request $request)
    {
        $request->validate([
            'app_name' => 'required|string|max:100',
        ]);

        Cache::forever('app_name', $request->app_name);
        config(['app.name' => $request->app_name]);

        return response()->json(['message' => 'System name updated successfully.', 'app_name' => $request->app_name]);
    }

    public function updateLoginPortalPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        Cache::forever('maintenance_login_secret', Hash::make($request->password));

        return response()->json(['message' => 'Login portal password updated successfully.']);
    }

    public function updateMailConfig(Request $request)
    {
        $data = $request->validate([
            'username' => 'nullable|string',
            'password' => 'nullable|string',
        ]);

        $existing = Cache::get('mail_config', []);

        Cache::forever('mail_config', [
            'username' => $data['username'] ?? null,
            'password' => filled($data['password'] ?? null)
                ? Crypt::encryptString($data['password'])
                : ($existing['password'] ?? null),
        ]);

        $this->applyMailConfig();

        return response()->json(['message' => 'Mail configuration saved successfully.']);
    }

    public function sendTestMail(Request $request)
    {
        $request->validate([
            'test_email' => 'required|email',
        ]);

        $this->applyMailConfig();

        try {
            Mail::raw('This is a test email from ' . config('app.name') . '. Your mail configuration is working correctly.', function ($message) use ($request) {
                $message->to($request->test_email)->subject('Test Email - ' . config('app.name'));
            });
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Failed to send test email: ' . $e->getMessage()], 422);
        }

        return response()->json(['message' => 'Test email sent successfully. Please check the inbox.']);
    }

    /**
     * Apply the cache-stored SMTP credentials to Laravel's runtime config for
     * the remainder of this request (also applied on every request boot via
     * AppServiceProvider so all Mail::/Mailable calls pick it up). Host, port,
     * encryption scheme, and from-address are all fixed via .env — only the
     * account username/password are editable here.
     */
    public static function applyMailConfig(): void
    {
        $mailConfig = Cache::get('mail_config');

        if (!$mailConfig) {
            return;
        }

        config([
            'mail.mailers.smtp.username' => $mailConfig['username'] ?? config('mail.mailers.smtp.username'),
            'mail.mailers.smtp.password' => !empty($mailConfig['password'])
                ? Crypt::decryptString($mailConfig['password'])
                : config('mail.mailers.smtp.password'),
        ]);
    }
}
