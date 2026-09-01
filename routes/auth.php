<?php

use App\Http\Controllers\Modules\AbsentForm\AbsentFormController;
use App\Http\Controllers\Modules\System\BackupController;
use App\Http\Controllers\Modules\Complaint\ComplaintController;
use App\Http\Controllers\Modules\GatePass\GatePassController;
use App\Http\Controllers\Modules\Referral\ReferralController;
use App\Http\Controllers\Modules\Account\RegisteredUserController;
use App\Http\Controllers\Auth\DashboardController;
use App\Http\Controllers\Modules\Account\AccountController;
use App\Http\Controllers\Modules\Violation\ViolationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Modules\Appointment\AppointmentController;
use App\Http\Controllers\Modules\Report\ArchiveController;
use App\Http\Controllers\Modules\Family\FamilyController;
use App\Http\Controllers\Modules\System\MaintenanceController;
use App\Http\Controllers\Modules\Family\ParentController;
use App\Http\Controllers\Modules\Report\ReportController;
use App\Http\Controllers\Modules\System\SystemSettingsController;
use App\Http\Controllers\Resource\FileController;
use App\Http\Controllers\Resource\WebPushController;
use App\Http\Controllers\TransactionController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| role:super_admin
|--------------------------------------------------------------------------
*/
Route::middleware(['role:super_admin', 'activate', 'user-activity'])->group(function() {

     Route::get('/maintenance', [MaintenanceController::class, 'index']);
     Route::get('/maintenance/preview', [MaintenanceController::class, 'preview']);
     Route::post('/maintenance/program/create', [MaintenanceController::class, 'programStore']);
     Route::post('/maintenance/program/update', [MaintenanceController::class, 'updateProgram']);
     Route::post('/maintenance/program/delete', [MaintenanceController::class, 'destroyProgram']);
     Route::post('/maintenance/mode/toggle', [MaintenanceController::class, 'toggleMaintenanceMode']);

     Route::get('/maintenance/backups', [BackupController::class, 'index']);
     Route::post('/maintenance/backups/database', [BackupController::class, 'createDatabaseBackup']);
     Route::post('/maintenance/backups/storage', [BackupController::class, 'createStorageBackup']);
     Route::post('/maintenance/backups/full', [BackupController::class, 'createFullBackup']);
     Route::get('/maintenance/backups/{filename}/download', [BackupController::class, 'download']);
     Route::post('/maintenance/backups/{filename}/delete', [BackupController::class, 'destroy']);

     Route::get('/super-admin/user-accounts', [AccountController::class, 'index'])
         ->name('type.super-admin.accounts');

     Route::get('/super-admin/profile/{id}', [ProfileController::class, 'index']);

     Route::get('/super-admin/accounts/register', [RegisteredUserController::class, 'index']);

     Route::post('/super-admin/register', [RegisteredUserController::class, 'store']);
     Route::post('/super-admin/register/upload-user', [RegisteredUserController::class, 'uploadUserStore']);
     Route::post('/super-admin/register/preview-student-csv', [RegisteredUserController::class, 'previewStudentCsv']);
     Route::post('/super-admin/register/commit-student-csv', [RegisteredUserController::class, 'commitStudentCsv']);
     Route::get('/api/register/validate/{type}/{value}/{id?}', [AccountController::class, 'validateUser']);

     Route::post('/super-admin/accounts/activation/{username}', [AccountController::class, 'toggle']);

     Route::post('/super-admin/user-accounts/del', [AccountController::class, 'destroy']);

     Route::get('/super-admin/student-list', [AccountController::class, 'studentListIndex']);

     Route::get('/super-admin/parent-request-list', [ParentController::class, 'index']);

     Route::get('/super-admin/parent-register/get/{id}', [ParentController::class, 'getParentRequest']);

     Route::get('/super-admin/program', [MaintenanceController::class, 'programIndex']);
     Route::post('/super-admin/user-accounts/file/del', [FileController::class, 'destroy']);
     Route::get('/super-admin/report', [ReportController::class, 'itrcIndex']);
     Route::get('/super-admin/report/generate', [ReportController::class, 'actionLogStore']);

     Route::post('/super-admin/account/update', [AccountController::class, 'updateUserInformation']);

     Route::get('/system-settings', [SystemSettingsController::class, 'index']);
     Route::post('/system-settings/login-portal-password', [SystemSettingsController::class, 'updateLoginPortalPassword']);
     Route::post('/system-settings/mail-config', [SystemSettingsController::class, 'updateMailConfig']);
     Route::post('/system-settings/mail-config/test', [SystemSettingsController::class, 'sendTestMail']);
     Route::post('/system-settings/app-name', [SystemSettingsController::class, 'updateAppName']);
});

/*
|--------------------------------------------------------------------------
| role:super_admin,sub_admin
|--------------------------------------------------------------------------
*/
Route::middleware(['role:super_admin,sub_admin', 'activate', 'user-activity'])->group(function() {
     Route::get('/violation-management', [MaintenanceController::class, 'violationManagementIndex']);
     Route::post('/maintenance/violation/create', [MaintenanceController::class, 'offenseStore']);
     Route::post('/maintenance/violation/update', [MaintenanceController::class, 'updateOffense']);
     Route::post('/maintenance/violation/delete', [MaintenanceController::class, 'destroyOffense']);
     Route::post('/maintenance/penalty/create', [MaintenanceController::class, 'penaltyStore']);
     Route::post('/maintenance/penalty/delete', [MaintenanceController::class, 'destroyPenalty']);
});

/*
|--------------------------------------------------------------------------
| role:super_admin,sub_admin,teaching_staff
|--------------------------------------------------------------------------
*/
Route::middleware(['role:super_admin,sub_admin,teaching_staff', 'activate', 'user-activity'])
     ->get('/download/user/account/{fileName}', [FileController::class, 'downloadAccountFile']);

/*
|--------------------------------------------------------------------------
| role:student
|--------------------------------------------------------------------------
*/
Route::middleware(['role:student', 'activate', 'user-activity'])->group(function() {
    Route::get('/student/profile/{id}', [ProfileController::class, 'index']);
    Route::post('/student/family/register', [RegisteredUserController::class, 'familyStore']);

    Route::get('/absent-form', [AbsentFormController::class, 'index']);
    Route::post('/student/absent-form/create', [AbsentFormController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| role:sub_admin
|--------------------------------------------------------------------------
*/
Route::middleware(['role:sub_admin', 'activate', 'user-activity'])->group(function() {
    Route::get('/prefect/student-list', [AccountController::class, 'studentListIndex']);

    Route::get('/prefect/family', [FamilyController::class, 'index'])
         ->name('type.prefect.family');
    Route::post('/prefect/family/action', [FamilyController::class, 'action']);

    Route::get('/prefect/archive', [ArchiveController::class, 'index']);

    Route::post('/prefect/call-in', [NotificationController::class, 'notifyCallIn']);
    Route::get('/prefect/violation', [ViolationController::class, 'violationIndex']);
    Route::post('/prefect/violation/risk/notify', [NotificationController::class, 'notifyFacultyProgramHead']);
    Route::post('/prefect/violation/create', [ViolationController::class, 'store']);

    Route::get('/prefect/profile/{id}', [ProfileController::class, 'index']);

    Route::get('/prefect/complaints', [ComplaintController::class, 'index']);

    Route::get('/prefect/referrals', [ReferralController::class, 'index']);
    Route::get('/prefect/absent-form', [AbsentFormController::class, 'index']);
    Route::post('/prefect/absent-form/verify/{id}/confirm', [AbsentFormController::class, 'confirmAbsentForm']);
    Route::post('/prefect/absent-form/verify/{id}/cancel', [AbsentFormController::class, 'cancelAbsentForm']);
    Route::get('/prefect/appointment', [AppointmentController::class, 'index']);

    Route::post('/prefect/gatepass/verify/{id}/confirm', [GatePassController::class, 'approveGatePassRequest']);
    Route::post('/prefect/gatepass/verify/{id}/cancel', [GatePassController::class, 'disapproveGatePassRequest']);

    Route::get('/prefect/gatepass', [GatePassController::class, 'index']);

    Route::post('/referral/verify/{id}/confirm', [ReferralController::class, 'confirmReferral']);
    Route::get('/referral/verify/{id}/send-guidance', [ReferralController::class, 'printReferralGuidance']);
    Route::post('/referral/verify/{id}/cancel', [ReferralController::class, 'destroy']);

    Route::get('/download/{type}/{id}', [ArchiveController::class, 'downloadDocument']);

    Route::get('/prefect/report', [ReportController::class, 'index']);
    Route::get('/prefect/analytic-report/generate', [ReportController::class, 'generateAnalyticReport']);
    Route::get('/prefect/report/generate', [ReportController::class, 'store']);
    Route::post('/prefect/archive/recover', [ArchiveController::class, 'recoverDocument']);
    Route::post('/prefect/archive/delete', [ArchiveController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| role:teaching_staff
|--------------------------------------------------------------------------
*/
Route::middleware(['role:teaching_staff', 'activate', 'user-activity'])->group(function() {
    Route::get('/teaching-staff/profile/{id}', [ProfileController::class, 'index']);
    Route::get('/teaching-staff/student-list', [AccountController::class, 'studentListIndex']);
    Route::get('/teaching-staff/faculty-list', [AccountController::class, 'facultyListIndex']);
});

/*
|--------------------------------------------------------------------------
| role:parent
|--------------------------------------------------------------------------
*/
Route::middleware(['role:parent', 'activate', 'user-activity'])->group(function() {
     Route::get('/children/monitor', [AccountController::class, 'childrenListIndex']);
});

/*
|--------------------------------------------------------------------------
| auth, activate, user-activity (any authenticated, active role)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'activate', 'user-activity'])->group(function() {
     Route::get('/dashboard', [DashboardController::class, 'index'])
          ->name('auth.dashboard');
     Route::get('/dashboard/active-users', [DashboardController::class, 'getActiveUsers']);

     Route::get('/appointment', [AppointmentController::class, 'index']);
     Route::post('/prefect/appointment/req/get/{reqId}', [AppointmentController::class, 'getReqList']);

     Route::post('/appointment/request', [AppointmentController::class, 'store']);
     Route::post('/appointment/update/{id}', [AppointmentController::class, 'update']);
     Route::post('/appointment/cancel', [AppointmentController::class, 'cancelAppointment']);
     Route::get('/appointment/cancel', [AppointmentController::class, 'cancelAppointment']);
     Route::post('/appointment/action', [AppointmentController::class, 'action']);
     Route::post('/calendar/appointment/get/list', [AppointmentController::class, 'getAppointment']);

     Route::get('/complaint', [ComplaintController::class, 'index']);
     Route::post('/complaint/create', [ComplaintController::class, 'store']);
     Route::post('/complaint/verify/{id}/cancel', [ComplaintController::class, 'cancelComplaint']);
     Route::post('/complaint/verify/{id}/confirm', [ComplaintController::class, 'confirmComplaint']);
     Route::post('/complaint/select/{type}', [ComplaintController::class, 'actionMultipleSelect']);
     Route::post('/complainant/get/{id}', [ComplaintController::class, 'get']);
     Route::get('/complaint/{id}/evidence/{fileName}', [ComplaintController::class, 'downloadEvidence']);
     Route::get('/complaint/{id}/subject/{fileName}', [ComplaintController::class, 'downloadSubjectDocument']);

     Route::post('/referral/create', [ReferralController::class, 'store']);
     Route::post('/referral/get/{id}', [ReferralController::class, 'get']);

     Route::post('/absent-form/get/{id}', [AbsentFormController::class, 'get']);
     Route::get('/absent-form/{id}/evidence/{fileName}', [AbsentFormController::class, 'downloadEvidence']);

     Route::get('/gatepass', [GatePassController::class, 'index']);
     Route::post('/gatepass/create', [GatePassController::class, 'gatepassRequest']);
     Route::post('/gatepass/verify/{id}/cancel', [GatePassController::class, 'disapproveGatePassRequest']);
     Route::get('/gatepass/{id}', [GatePassController::class, 'get']);
     Route::get('/gatepass/approved-users', [GatePassController::class, 'getAllApprovedGatePass']);

     Route::get('/notification/{receiver}/{l}', [NotificationController::class, 'getNotif']);
     Route::get('/api/notification/{type}', [NotificationController::class, 'getStudentNotification']);
     Route::get('/notifications', [NotificationController::class, 'index']);
     Route::post('/notifications/delete/{type}', [NotificationController::class, 'destroy']);
     Route::post('/notification/read', [NotificationController::class, 'markAsRead']);

     Route::post('/store-subscription', [WebPushController::class, 'store']);

     Route::get('/transaction/limit', [TransactionController::class, 'getLimit']);

     Route::get('/student-risk/{id}', [ViolationController::class, 'studentRiskIndex']);
     Route::get('/student-violation/{id}', [ViolationController::class, 'studentViolationIndex']);
     Route::get('/incident/list/{id}', [ViolationController::class, 'getStudentIncident']);
     Route::get('/violation/list/{id}', [ViolationController::class, 'getStudentViolation']);
     Route::get('/violation-occurence/list/{id}', [ViolationController::class, 'getStudentViolationOccurence']);
     Route::get('/incident/student/{id}', [ViolationController::class, 'getStudentRiskStatus']);

     Route::post('/profile/{username}/edit', [ProfileController::class, 'update']);
     Route::get('/profile/{username}/edit', [ProfileController::class, 'edit']);

     Route::get('/all-users', function() {
          $account = new User();
          return $account->allUserAccount();
     });
     Route::get('/api/all-users/{type}', [AccountController::class, 'searchAllUsers']);
     Route::get('/all-students', function() {
          return User::with(['student' => function($query) {
               $query->with('program')
                    ->get();
          }])->where('role', 'student')->get();
     });
     Route::get('/settings/{id}', [AccountController::class, 'accountSettingsIndex']);
});

/*
|--------------------------------------------------------------------------
| auth, activate (no user-activity ping)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'activate'])->group(function() {
     Route::get('/referral', [ReferralController::class, 'index']);
     Route::post('/account/update', [AccountController::class, 'update']);
     Route::get('/api/password/verify/{value}/{id}', [AccountController::class, 'checkCurrentPassword']);
});

/*
|--------------------------------------------------------------------------
| auth, activate, profile-authorized, user-activity
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'activate', 'profile-authorized', 'user-activity'])
     ->get('/profile/{username}', [ProfileController::class, 'index']);

/*
|--------------------------------------------------------------------------
| No auth middleware (left as-is: reachable without a logged-in session)
|--------------------------------------------------------------------------
*/
Route::post('/gatepass/verify/{source}/scan', [GatePassController::class, 'verifyGatePassQRCode']);
Route::post('/gatepass/approved-users', [GatePassController::class, 'getAllApprovedGatePass']);
Route::post('/appointment/schedule/{id}/{type}', [AppointmentController::class, 'get']);
