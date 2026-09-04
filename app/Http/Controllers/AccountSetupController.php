<?php

namespace App\Http\Controllers;

use App\Models\ActionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AccountSetupController extends Controller
{
    /**
     * Step 1 of forced setup: the user must verify their email before
     * reaching the profile/password steps. Already-verified users are
     * bounced straight to the profile step (this page has nothing left for
     * them to do).
     */
    public function verifyEmailPrompt()
    {
        $user = auth()->user();

        if ($user->hasVerifiedEmail()) {
            return redirect("/profile/{$user->username}/edit");
        }

        return Inertia::render('auth/verify-email', [
            'user' => $user,
            'email' => $user->email,
        ]);
    }

    public function resendVerificationEmail()
    {
        $user = auth()->user();

        if (!$user->hasVerifiedEmail()) {
            $user->sendEmailVerificationNotification();
        }

        return response()->json(['message' => 'Verification link sent.']);
    }

    /**
     * Complete forced first-login setup: profile completion and the
     * password change are submitted together and persisted atomically —
     * neither is saved unless both are present and valid.
     */
    public function complete(Request $request)
    {
        $user = auth()->user();

        if (!session('force_account_setup')) {
            abort(404);
        }

        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
            'religion' => 'required|string',
            'citizenship' => 'required|string',
            'civil_status' => 'required|string',
            'date_of_birth' => 'required|date',
            'place_of_birth' => 'required|string',
            'sex' => 'required|in:m,f',
            'current_place' => 'required|string',
            'current_city' => 'required|string',
            'current_province' => 'required|string',
            'current_zipcode' => 'required|string',
            'permanent_place' => 'required|string',
            'permanent_city' => 'required|string',
            'permanent_province' => 'required|string',
            'permanent_zipcode' => 'required|string',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['error' => 'Current password is incorrect'], 422);
        }

        DB::transaction(function () use ($request, $user) {
            (new ProfileController)->applyProfileFields($user, $request);

            $user->update([
                'password' => Hash::make($request->password),
                'already_update_profile' => true,
                'already_update_password' => true,
            ]);
        });

        session()->forget('force_account_setup');

        ActionLog::create([
            'user_id' => $user->id,
            'action_type' => 'account_setup',
            'details' => 'completed forced profile and password setup',
        ]);

        return response()->json(['message' => 'successfully']);
    }
}
