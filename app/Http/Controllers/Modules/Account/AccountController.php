<?php

namespace App\Http\Controllers\Modules\Account;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessStudentAccountUpdate;
use App\Models\ActionLog;
use App\Models\Complaint;
use App\Models\ComplaintSubject;
use App\Models\Family;
use App\Models\FamilyMember;
use App\Models\Program;
use App\Models\Referral;
use App\Models\TeachingStaff;
use App\Models\UserPermission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\User;
use Exception;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use ZipArchive;

class AccountController extends Controller
{
    private $id;

    public function index() {
        $account = new User();

        return Inertia::render('itrc/accounts',
            array_merge($account->allUserAccount(), [
                'program_name' => self::isProgramHead(),
                'program' => Program::all(['id', 'name'])
            ]));
    }

    public function updateUserInformation(Request $request) {
        UserPermission::updateOrCreate(
            ['user_id' => $request->user_id],
            self::getUserFields($request)
        );

        return response()->json(['status' => 'User Information Updated Successfully']);
    }

    public function studentListIndex() {
        $programHead = TeachingStaff::with('program')
                            ->where('user_id', auth()->user()->id)
                            ->where('position', 'program_head')
                            ->first();

        $isPrefect = (auth()->user()->role === 'sub_admin') ? 'prefect' : 'other';

        $props = $programHead
                 ? array_merge([
                    'user' => auth()->user(),
                    'students' => [
                        'data' => self::getStudent()
                    ],
                    'program' => Program::all(['id', 'name']),
                    'program_name' => $programHead->program->name,
                    'file_name' => "student-{$programHead->program_id}-{$programHead->program->name}.zip",
                    'file_name_faculty' => "faculty-account-{$programHead->program_id}-{$programHead->program->name}.csv"
                ])
                 : [
                    'user' => auth()->user(),
                    'students' => [
                        'data' => self::getStudent()
                    ],
                    'program' => Program::all(['id', 'name', 'description', 'color_code']),
                 ];

        return Inertia::render("$isPrefect/students", $props);
    }

    public function facultyListIndex() {
        $isPrefect = (auth()->user()->role === 'sub_admin') ? 'prefect' : 'other';
        $programHead = TeachingStaff::with('program')
                            ->where('user_id', auth()->user()->id)
                            ->where('position', 'program_head')
                            ->first();

        $props = $programHead
                 ? array_merge([
                    'user' => auth()->user(),
                    'faculty' => self::getFaculty(),
                    'program_name' => self::isProgramHead(),
                    'file_name' => "faculty-account-{$programHead->program_id}-{$programHead->program->name}.csv",
                ])
                 : [
                    'user' => auth()->user(),
                    'faculty' => self::getFaculty(),
                    'program_name' => self::isProgramHead(),
                    'program' => Program::all(['id', 'name']),
                 ];

        return Inertia::render("$isPrefect/faculty", $props);
    }

    public function childrenListIndex() {
        $familyId = FamilyMember::where('member_id', auth()->user()->id)->value('family_id');

        return Inertia::render('parent/children-monitoring', [
            'user' => auth()->user(),
            'children' => User::with('profile')
                            ->whereIn('id', FamilyMember::where('family_id', $familyId)->pluck('member_id'))
                            ->where('role', 'student')
                            ->get()
            ]);
    }

    public function userRequestMonitoring() {
        return Inertia::render('itrc/user-request-monitoring', [
            'user' => auth()->user()
        ]);
    }

    public function accountSettingsIndex($id) {
        $props = [
            'user' => auth()->user(),
            'program_name' => self::isProgramHead(),
            'otherUserAccount' => User::with('profile')->where('username', $id)->first()
        ];

        return Inertia::render('itrc/account-settings', $props);
    }

    public function update(Request $request)
    {
        // This endpoint only ever updates the authenticated user's own account —
        // never trust an id from the request for the target row (that was the
        // account-takeover bug: a client-supplied user_id let anyone overwrite
        // anyone else's credentials).
        $user = auth()->user();

        // Only touch the fields actually present in this request — a
        // password-only submission (or a username/email-only one) must not
        // blank out the fields it wasn't given.
        $fields = [];

        if ($request->filled('username')) {
            $fields['username'] = strtolower($request->username);
        }

        if ($request->filled('email')) {
            $fields['email'] = strtolower($request->email);
        }

        // ============================================================
        // 🔹 PASSWORD CHANGE CHECK
        // ============================================================
        $wantsPasswordChange = $request->password || $request->password_confirmation;

        // ============================================================
        // 🔹 If password change is requested
        // ============================================================
        if ($wantsPasswordChange) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'error' => 'Current password is incorrect'
                ], 422);
            }

            // Add new password to update array
            $fields['password'] = Hash::make($request->password);
        }

        // ============================================================
        // 🔹 Perform Update
        // ============================================================
        if (!empty($fields)) {
            $user->update($fields);
        }

        // ============================================================
        // 🔹 Log Action
        // ============================================================
        ActionLog::create([
            'user_id'     => $user->id,
            'action_type' => 'account_update',
            'details'     => 'Updated user account credentials'
        ]);

        // Return updated fields (excluding password)
        return response()->json([
            'success' => true,
            'data' => $user->only(['email', 'username'])
        ]);
    }

    public function checkCurrentPassword($value, $id) {
        $user = auth()->user();

        if (!$user || (int) $id !== $user->id) {
            return response()->json(false);
        }

        return response()->json(Hash::check($value, $user->password));
    }

    public function uploadUpdateStudent(Request $request) {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv',
            'school_year' => 'string|required'
        ]);

        $path = storage_path("app/private/zips/student_dataset.csv");

        try {
            if (File::exists($path)) {
                return response()->json([
                    'status'  => 'locked',
                    'message' => 'Your previous CSV is still being processed. Please wait until it finishes.'
                ], 423);
            }
            File::delete($path);
            File::put($path, request()->file('file')->getContent());

            ProcessStudentAccountUpdate::dispatch($path, $request->school_year);
            ActionLog::create([
                'user_id' => auth()->user()->id,
                'action_type' => 'update',
                'details' => 'uploads a currently enrolled students csv file for automatic student account generation',
            ]);

            return response()->json([
                'message' => "Successfully processed all students."
            ]);
        }catch(Exception $x) {
            File::delete($path);
            return response()->json([
                'message' => "There was an error."
            ], 400);
        }
    }

    public function recoverPassword(Request $request) {
        $email = User::where('username', $request->username)->value('email');
        $key = $email . '_otp_hash';
        if(!cache($key . '_verified')) {
            return response()->json(['message' => 'error'], 500);
        }
        cache()->forget($key . '_verified');
        self::updatePassword($request);
    }
    public function searchAccount($username) {
        $account = new User();
        return response()->json([$account->findAccountContactDetail($username)]);
    }
    public function accountSettings() {
        return Inertia::render('other/account-settings', [
            'user' => auth()->user()
        ]);
    }
    public function toggle($username, Request $request) {
        if($username == 'all-users') {
            $account = new User();
            User::whereIn('id', $request->ids)
                ->update(['activate' => $request->status]);
            return response()->json($account->allUserAccount());
        }else {
            User::where('username', $username)
                ->update(['activate' => $request->status]);
        }
    }
    public function setActivityStatus(Request $request) {
        auth()->user()->update(['activate' => $request->status]);
    }



    private function updatePassword($request) {
        User::where('username', $request->username)
            ->update([
                'password' => Hash::make($request->new_password)
            ]);
    }
    public function destroy(Request $request)
{
    $userIds = [];

    // Allow single or multiple delete input
    if ($request->has('user_ids')) {
        $userIds = $request->user_ids;
    } elseif ($request->has('user_id')) {
        $userIds = [$request->user_id];
    } else {
        return response()->json(['message' => 'No user selected for deletion.'], 400);
    }

    $deleted = [];
    $skipped = [];
    $notFound = [];

    foreach ($userIds as $userId) {

        $user = User::where('id', $userId)->first();

        if (!$user) {
            $notFound[] = $userId;
            continue;
        }

        $role = $user->role;

        // 🔶 super_admin / sub_admin — must leave at least 1 remaining
        if (in_array($role, ['super_admin', 'sub_admin'])) {
            $count = User::where('role', $role)->count();

            if ($count <= 1) {
                $skipped[] = [
                    'user_id' => $userId,
                    'reason' => "At least two {$role} accounts are required."
                ];
                continue;
            }
        }

        DB::beginTransaction();
        try {

            // ❌ Check linked data (complaints / referrals)
            $hasComplaint = Complaint::where('complainant_id', $userId)
                ->orWhereHas('complaintSubject', fn($q) => $q->where('student_id', $userId))
                ->exists();

            $hasReferral = Referral::where('program_head_id', $userId)
                ->orWhereHas('referralReferredStudent', fn($q) => $q->where('student_id', $userId))
                ->exists();

            if ($hasComplaint || $hasReferral) {
                DB::rollBack();
                $skipped[] = [
                    'user_id' => $userId,
                    'reason' => 'User has linked complaints or referrals.'
                ];
                continue;
            }

            // 🔶 Parent logic
            $deleteFamily = false;
            $familyId = null;
            if ($role === 'parent') {

                $familyMember = FamilyMember::where('member_id', $userId)->first();

                if ($familyMember) {
                    $familyId = $familyMember->family_id;

                    $parentCount = User::whereIn('id', FamilyMember::where('family_id', $familyId)->pluck('member_id'))
                        ->where('role', 'parent')
                        ->count();

                    $deleteFamily = ($parentCount == 1);
                }
            }

            // 🖼 Delete Profile Picture
            if ($user->profile?->profile_picture) {
                Storage::disk('public')->delete("profile-pictures/{$user->profile->profile_picture}");
            }

            // 🧩 Remove user from CSV
            $this->removeUserFromFile($user);

            // 🗑 Delete user
            $user->delete();

            if ($deleteFamily && $familyId) {
                Family::where('id', $familyId)->delete();
                FamilyMember::where('family_id', $familyId)->delete();
            }

            DB::commit();
            $deleted[] = $userId;

        } catch (\Exception $e) {
            DB::rollBack();
            $skipped[] = [
                'user_id' => $userId,
                'reason' => 'Internal error: ' . $e->getMessage()
            ];
        }
    }

    // 🔥 FINAL RESPONSE HANDLER
    if (!empty($skipped) || !empty($notFound)) {
        return response()->json([
            'message' => 'Some users could not be deleted.',
            'deleted_users' => $deleted,
            'skipped_users' => $skipped,
            'not_found_users' => $notFound
        ], 400); // 🚨 ERROR STATUS CODE
    }

    // 🟢 FULL SUCCESS
    return response()->json([
        'message' => 'All selected users were successfully deleted.',
        'deleted_users' => $deleted
    ], 200);
}




    private function setId($s) {
        $this->id = $s;
    }
    public function removeUserFromFile($user)
    {
        if ($user->role === 'student') {
            Log::info('student');
            return self::removeStudentFromZip($user);
        }

        if (in_array($user->role, ['teaching_staff', 'non_teaching_staff'])) {
            Log::info('teaching or non-teaching staff');
            return self::removeEmployeeFromCsv($user);
        }

        return false;
    }

    /**
     * Remove a student from their program ZIP and year CSV.
     */
    protected function removeStudentFromZip($user)
    {
        $user->loadMissing('enrollments.program');
        $enrollment = $user->enrollments->sortByDesc('id')->first();

        if (!$enrollment || !$enrollment->program) {
            return false;
        }

        $program = $enrollment->program;
        $zipName = "student-{$program->id}-{$program->name}.zip";
        $zipPath = storage_path("app/private/zips/{$zipName}");
        $csvName = "student-account-{$program->id}-{$program->name}-year-{$enrollment->year_level}.csv";

        if (!file_exists($zipPath)) {
            return false;
        }

        $zip = new ZipArchive;
        $tmpExtractPath = storage_path("app/tmp_zip_read/student_delete");

        // Reset temp folder
        if (File::exists($tmpExtractPath)) {
            File::deleteDirectory($tmpExtractPath);
        }
        File::makeDirectory($tmpExtractPath, 0755, true);

        if ($zip->open($zipPath) === true) {
            if ($zip->locateName($csvName) !== false) {
                $zip->extractTo($tmpExtractPath, [$csvName]);
                $csvPath = "{$tmpExtractPath}/{$csvName}";

                if (file_exists($csvPath)) {
                    $fileRows = array_map('str_getcsv', file($csvPath));
                    $header = array_shift($fileRows);

                    // Filter out the user row
                    $filteredRows = array_filter($fileRows, function ($row) use ($user) {
                        return strtolower(trim($row[0])) !== strtolower($user->id_number ?? '');
                    });

                    // Rewrite CSV
                    $fp = fopen($csvPath, 'w');
                    fputcsv($fp, $header);
                    foreach ($filteredRows as $r) {
                        fputcsv($fp, $r);
                    }
                    fclose($fp);

                    // Replace CSV inside ZIP
                    $zip->deleteName($csvName);
                    $zip->addFile($csvPath, $csvName);
                }
            }
            $zip->close();
        }

        File::deleteDirectory($tmpExtractPath);
        return true;
    }

    /**
     * Remove faculty or staff from their CSV.
     */
    protected function removeEmployeeFromCsv($user)
    {
        try {
            $programId = null;
            $programName = null;

            // ✅ Get teaching-staff program if applicable
            if ($user->role === 'teaching_staff') {
                $teachingStaff = $user->teachingStaff()->with('program')->first();

                // 🩹 Safely access related program
                if ($teachingStaff && $teachingStaff->program) {
                    $programId = $teachingStaff->program->id;
                    $programName = Str::slug($teachingStaff->program->name, '-');
                } else {
                    Log::warning("Teaching staff {$user->id_number} has no program relationship.");
                    return false;
                }
            }

            // ✅ Build CSV path safely
            $csvPath = match ($user->role) {
                'teaching_staff'     => storage_path("app/private/zips/faculty-account-{$programId}-{$programName}.csv"),
                'non_teaching_staff' => storage_path("app/private/zips/staff-account.csv"),
                default              => null,
            };

            if (!$csvPath || !file_exists($csvPath)) {
                Log::warning("CSV file missing for {$user->id_number}: {$csvPath}");
                return false;
            }

            // ✅ Read the CSV file
            $fileRows = array_map('str_getcsv', file($csvPath));
            if (empty($fileRows)) return false;

            $header = array_shift($fileRows);

            // ✅ Filter out deleted user
            $filteredRows = array_filter($fileRows, fn($r) =>
                strtolower(trim($r[0])) !== strtolower($user->id_number ?? '')
            );

            // ✅ Write updated data to a temporary file first
            $tempPath = $csvPath . '.tmp';
            $fp = fopen($tempPath, 'w');
            fputcsv($fp, $header);
            foreach ($filteredRows as $r) {
                fputcsv($fp, $r);
            }
            fclose($fp);

            // ✅ Replace old CSV atomically
            if (file_exists($tempPath)) {
                rename($tempPath, $csvPath);
            }

            return true;
        } catch (Exception $e) {
            Log::error('removeEmployeeFromCsv failed: ' . $e->getMessage());
            if (isset($tempPath) && file_exists($tempPath)) @unlink($tempPath);
            throw $e; // Let parent rollback DB transaction
        }
    }

    public function getAllUser($l) {
        $account = new User();
        return $account->allUserAccount();
    }
    public function getContact($username) {
        $user = User::with('profile')
                    ->where(function($q) use ($username) {
                        $q->where('username', $username)->orWhere('id_number', $username);
                    })
                    ->first();

        if (!$user) {
            return response()->json(['message' => "This Account Doesn't Exists."], 400);
        }

        if (empty($user->email) && empty($user->profile?->contact_number)) {
            return response()->json(['message' => "This Account Doesn't Have Email."], 400);
        }

        return response()->json([
            'email' => $user->email ?: null,
            'contact_number' => $user->profile?->contact_number ?: null,
        ]);
    }
    public function getFaculty() {
        $myTeachingStaff = TeachingStaff::where('user_id', auth()->user()->id)->first();
        $isProgramHead = $myTeachingStaff && $myTeachingStaff->position === 'program_head';

        $data = User::with(['profile', 'teachingStaff.program'])
                    ->where('role', 'teaching_staff');

        if (in_array(auth()->user()->role, ['super_admin', 'sub_admin']) || $isProgramHead) {
            // Filter by program if not "all"
            if (isset($_GET['program']) && $_GET['program'] != 'all') {
                $data->whereHas('teachingStaff', function ($q) {
                    $q->where('program_id', $_GET['program']);
                });
            }

            // Apply search filter if present
            if (isset($_GET['search']) && $_GET['search'] !== '') {
                $data = $data->where('id_number', 'like', "%{$_GET['search']}%")
                            ->latest('created_at')
                            ->paginate(100)
                            ->appends([
                                'search' => $_GET['search'],
                            ]);
            } else {
                $programId = $myTeachingStaff?->program_id;

                $data = (is_null($programId))
                        ?
                        $data->latest('created_at')
                            ->paginate(100)
                            ->appends([
                                'program' => $_GET['program'] ?? 'all',
                            ])
                        :
                        $data->latest('created_at')
                            ->whereHas('teachingStaff', function ($q) use($programId) {
                                $q->where('program_id', $programId);
                            })
                            ->paginate(100)
                            ->appends([
                                'program' => $_GET['program'] ?? 'all',
                            ]);
            }

            return $data;
        } else {
            $programId = $myTeachingStaff?->program_id;

            self::setId($programId);

            return TeachingStaff::with(['program', 'user.profile'])
                          ->where('program_id', self::getId())
                          ->paginate(10);
        }
    }
    public function getStudent() {
        $myTeachingStaff = auth()->user()->role === 'teaching_staff'
                         ? TeachingStaff::where('user_id', auth()->user()->id)->first()
                         : null;
        $isProgramHead = $myTeachingStaff && $myTeachingStaff->position === 'program_head';

        $data = User::with(['profile', 'program', 'enrollments'])
                    ->where('role', 'student')
                    ->whereHas('enrollments', function($q) {
                        $q->where('status', 'enrolled');
                    });

        if (in_array(auth()->user()->role, ['sub_admin', 'super_admin']) || $isProgramHead) {
            // Filter by program if not "all"
            if (isset($_GET['program']) && $_GET['program'] != 'all') {
                $data->whereHas('enrollments', function ($q) {
                    $q->where('program_id', $_GET['program']);
                });
            }

            // Filter by year level if not "all"
            if (isset($_GET['school-year']) && $_GET['school-year'] != 'all') {
                $data->whereHas('enrollments', function ($q) {
                    $q->where('school_year', $_GET['school-year']);
                });
            }

            // Apply search filter if present
            if (isset($_GET['search']) && $_GET['search'] !== '') {
                $data = $data->where('id_number', 'like', "%{$_GET['search']}%")
                            ->latest('created_at')
                            ->get();
            } else {
                $programId = $myTeachingStaff?->program_id;

                $data = (is_null($programId))
                        ?
                        $data->latest('created_at')->get()
                        :
                        $data->latest('created_at')
                            ->whereHas('enrollments', function ($q) use($programId) {
                                $q->where('program_id', $programId);
                            })
                            ->get();
            }

            return $data;
        } else {
            $programId = $myTeachingStaff?->program_id;

            self::setId($programId);

            $data = User::with(['program'])
                ->where('role', 'student')
                ->where('id', '!=', auth()->user()->id);

            if (self::getId()) {
                $data->whereHas('enrollments', function ($q) {
                    $q->where('program_id', self::getId());
                });
            }

            if (request()->has('year-level') && request('year-level') !== 'all') {
                $data->whereHas('enrollments', function ($q) {
                    $q->where('year_level', request('year-level'));
                });
            }

            return $data->get();
        }
    }

    public function getUsers($type) {
        $data = null;
        $search = $_GET['search'];
        $dateRegistered = array_key_exists('date_registered', $_GET)  ? $_GET['date_registered'] : null;
        $user = new User();
        $authId = auth()->user()->id;

        switch($type) {
            case 'student':
                $myTeachingStaff = TeachingStaff::where('user_id', $authId)->first();
                $hasId = $myTeachingStaff?->program_id ?? '';

                $data = User::with(['profile', 'program'])
                    ->where('role', 'student')
                    ->where('id', '!=', $authId);

                // if user has a program, filter students by it
                /*if ($hasId && !str_contains($_SERVER['REQUEST_URI'], '/complai')) {
                    $data->whereHas('enrollments', function ($q) use ($hasId) {
                        $q->where('program_id', $hasId);
                    });
                }else {
                    $data = $data;
                }*/

                break;
            case 'program_student':
                $myTeachingStaff = TeachingStaff::where('user_id', $authId)->first();
                $hasId = $myTeachingStaff?->program_id;

                $data = User::with(['profile', 'program'])
                    ->where('role', 'student')
                    ->where('id', '!=', $authId);

                if ($hasId) {
                    $data->whereHas('enrollments', function ($q) use ($hasId) {
                        $q->where('program_id', $hasId);
                    });
                }else {
                    $data = $data;
                }
                break;
            case 'faculty':
                $myTeachingStaff = TeachingStaff::where('user_id', $authId)->first();
                $isProgramHead = $myTeachingStaff && $myTeachingStaff->position === 'program_head';

                $data = (!$isProgramHead)
                        ?
                        $user->with(['profile', 'teachingStaff.program'])
                             ->where('role', 'teaching_staff')
                             ->where('id', '!=', $authId)
                        :
                        $user->with(['profile', 'teachingStaff.program'])
                             ->where('role', 'teaching_staff')
                             ->whereHas('teachingStaff', function ($q) use ($myTeachingStaff) {
                                 $q->where('program_id', $myTeachingStaff->program_id);
                             })
                             ->where('id', '!=', $authId);
                break;
            case 'student_parent':
                $data = $user->whereIn('role', ['student', 'parent'])
                             ->with(['profile', 'program', 'parent.profile']);
                break;
            case 'resolved_student_complaint':
                $data = $user->with(['profile', 'program', 'complaintSubject' => function($q) {
                                $q->where('complaint_status', 'resolved');
                            }])
                             ->whereHas('complaintSubject', function($q) {
                                $q->where('complaint_status', 'resolved');
                             });
                break;
            case 'all':
                $data = $user->with(['profile', 'program', 'teachingStaff.program', 'parent'])
                             ->where('id', '!=', $authId);
                break;
            case 'all-2':
                $data = $user->with(['profile', 'program', 'teachingStaff.program', 'parent']);
                break;
            case 'family':
                $data = Family::where('family_code', 'like', "%$search%")->limit(5)->get()->map(function ($d) {
                    return [
                        'id' =>$d->id,
                        'family_name' => $d->family_code . '-' . $d->family_name
                    ];
                });
                break;
            case 'family-student':
                $data = $user->whereNotIn('id', FamilyMember::pluck('member_id'))
                            ->with(['profile', 'program'])
                            ->where('role', 'student')
                            ->where('id', '!=', $authId);
                break;
        }
        if($type != 'family') {
            if (!empty($search)) {
                $data = $data->where(function ($query) use ($search) {
                    $query->whereHas('profile', function ($q) use ($search) {
                    $search = trim($search);

                    // Split by spaces to handle multi-word searches (e.g. "John Doe")
                    $parts = explode(' ', $search);

                    // Single word (e.g. "John")
                    if (count($parts) === 1) {
                        $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('middle_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                    }
                    // Two words (e.g. "John Doe" or "Doe John")
                    elseif (count($parts) === 2) {
                        [$first, $second] = $parts;

                        $q->where(function ($sub) use ($first, $second) {
                            $sub->where(DB::raw("CONCAT(first_name, ' ', last_name)"), 'like', "%{$first} {$second}%")
                                ->orWhere(DB::raw("CONCAT(last_name, ' ', first_name)"), 'like', "%{$first} {$second}%");
                        });
                    }
                    // Three or more words (e.g. "John A. Doe")
                    else {
                        $q->where(DB::raw("CONCAT(first_name, ' ', middle_name, ' ', last_name)"), 'like', "%{$search}%")
                        ->orWhere(DB::raw("CONCAT(first_name, ' ', last_name)"), 'like', "%{$search}%");
                    }
                });
                    $query->orWhere('id_number', 'like', "%{$search}%");
                });

                $data = $data->limit(5)->get();
            }if(!empty($dateRegistered)) {
                $data = $data->where(DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d')"), $dateRegistered)
                             ->latest('created_at')
                             ->get();
            }

        }
        return $data;
    }
    public function getStudentParent() {
        return User::whereIn('role', ['student', 'parent'])
                    ->with(['program', 'parent'])
                    ->get();
    }
    public function searchAllUsers(Request $request, string $type) {
        $search = trim($request->query('search', ''));

        $query = User::with('profile')->where('id', '!=', auth()->id());

        switch ($type) {
            case 'faculty':
                $query->where('role', 'teaching_staff');
                break;
            case 'student':
            case 'family-student':
                $query->where('role', 'student');
                break;
            case 'program_student':
                $query->where('role', 'student');
                $myTeachingStaff = auth()->user()->role === 'teaching_staff'
                    ? TeachingStaff::where('user_id', auth()->id())->first()
                    : null;
                if ($myTeachingStaff?->program_id) {
                    $query->whereHas('enrollments', function ($q) use ($myTeachingStaff) {
                        $q->where('program_id', $myTeachingStaff->program_id);
                    });
                }
                break;
            case 'student_parent':
                $query->whereIn('role', ['student', 'parent']);
                break;
            case 'resolved_student_complaint':
                $studentIds = ComplaintSubject::whereHas('complaint', function ($q) {
                    $q->where('complaint_status', 'resolved');
                })->pluck('student_id');
                $query->where('role', 'student')->whereIn('id', $studentIds);
                break;
            case 'all-2':
                break;
            default:
                abort(404);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('id_number', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhereHas('profile', function ($p) use ($search) {
                        $p->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%");
                    });
            });
        }

        return response()->json(
            $query->latest('users.created_at')->limit(10)->get()
        );
    }
    private function getId() {
        return $this->id;
    }
    private function getUserFields($request) {
        return [
            'allow_complaint' => $request->allow_complaint,
            'allow_referral' => $request->allow_referral,
            'allow_absent_form' => $request->allow_absent_form,
            'allow_appointment' => $request->allow_appointment,
            'allow_gatepass' => $request->allow_gatepass,
        ];
    }
    public function getUserAccessField($data = null, $type) {
        switch($type) {
            case 'student':
                return array_merge($data, [
                    'allow_complaint' => 1,
                    'allow_absent_form' => 1,
                    'allow_appointment' => 1,
                    'allow_gatepass' => 1,
                ]);
            case 'super_admin':
                return array_merge($data, [
                    'allow_complaint' => 1,
                    'allow_gatepass' => 1,
                ]);
            case 'non_teaching_staff':
                return array_merge($data, [
                    'allow_complaint' => 1,
                    'allow_gatepass' => 1,
                ]);
            case 'teaching_staff':
                return array_merge($data, [
                    'allow_complaint' => 1,
                    'allow_gatepass' => 1,
                ]);
            case 'parent':
                return array_merge($data, [
                    'allow_complaint' => 1,
                    'allow_appointment' => 1,
                ]);
            default:
                return array_merge($data, [
                    'allow_complaint' => 1,
                    'allow_referral' => 1,
                    'allow_absent_form' => 1,
                    'allow_appointment' => 1,
                    'allow_gatepass' => 1,
                ]);
        }
    }
    public function validateUser($type, $value, $id = null) {
        $authUserId = auth()->check()
                      ?
                      auth()->user()->id
                      :
                      null;

        // Find any user with same username/email except the one being edited
        $exists = auth()->check()
                  ?
                  User::where($type, $value)
                      ->when($id, function($q) use ($id) {
                          $q->where('id', '!=', $id); // exclude user being edited
                      })
                      ->exists()
                  :
                  User::where($type, $value)->exists();


        // 🟢 Special Rule: If admin enters THEIR OWN username/email
        // while editing another user's info → ignore conflict
        if (auth()->check() && (auth()->user()->role === 'super_admin' && !is_null($id))) {
            if($authUserId != $id) {
                $isAdminOwnCredential = User::where('id', $authUserId)
                                        ->where($type, $value)
                                        ->exists();

                if ($isAdminOwnCredential) {
                    return response()->json(true); // treat as "not existing"
                }
            }
        }

        return response()->json($exists);
    }

    public function isProgramHead() {
        $admin = TeachingStaff::with('program')
                            ->where('user_id', auth()->user()->id)
                            ->where('position', 'program_head')
                            ->first();
        return $admin?->program?->name;
    }
}
