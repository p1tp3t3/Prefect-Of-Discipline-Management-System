<?php
use App\Http\Controllers\Modules\Account\AccountController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Modules\GatePass\GatePassController;
use App\Http\Controllers\Modules\Family\ParentController;
use App\Http\Controllers\Modules\Account\RegisteredUserController;
use App\Http\Controllers\OTPVerificationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [AuthenticatedSessionController::class, 'create'])
->name('type.user');

Route::get('/login', [AuthenticatedSessionController::class, 'create']);

Route::get('/parent-register', [RegisteredUserController::class, 'parentRegistrationIndex']);

Route::post('/parent-register/send', [ParentController::class, 'store']);


Route::get('/gatepass/log-in', [AuthenticatedSessionController::class, 'gatePassLogin'])
     ->name('gatepass.login');

Route::get('/super-admin/login/{password}', [AuthenticatedSessionController::class, 'maintenanceLoginCreate'])
     ->name('super-admin.maintenance-login');

Route::post('/super-admin/login/{password}', [AuthenticatedSessionController::class, 'maintenanceLoginStore'])
     ->name('super-admin.maintenance-login.attempt');

Route::post('/log-in', [AuthenticatedSessionController::class, 'store'])
     ->name('log-in');

Route::post('/contact/{username}', [AccountController::class, 'getContact']);

Route::get('/forgot-password', [OTPVerificationController::class, 'contactIndex'])
->name('verify.otp');

Route::post('/otp/verify', [OTPVerificationController::class, 'verify']);

Route::post('/forgot-password/otp', [OTPVerificationController::class, 'store'])
->name('verify.send_otp');

Route::post('/forgot-password/recover', [AccountController::class, 'recoverPassword'])
->name('verify.recover');

Route::middleware('auth')
     ->get('/log-out', [AuthenticatedSessionController::class, 'destroy'])
     ->name('log-out');

Route::get('/gatepass-verification', [GatePassController::class, 'qrcodeIndex'])
     ->name('gatepass-validation');

Route::get('/webpush', function() {
     return Inertia::render('test', ['keys' => 't']);
});

require __DIR__ . '/auth.php';


