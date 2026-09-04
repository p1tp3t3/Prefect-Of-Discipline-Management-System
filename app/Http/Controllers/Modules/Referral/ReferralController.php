<?php

namespace App\Http\Controllers\Modules\Referral;

use App\Events\SendReferral;
use App\Http\Controllers\Controller;
use App\Http\Requests\Referral\StoreReferralRequest;
use App\Http\Resources\ReferralResource;
use App\Mail\ReferralMail;
use App\Models\ActionLog;
use App\Models\Referral;
use App\Models\ReferralReferredStudent;
use App\Models\User;
use App\Traits\GeneratesSequenceCode;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use ZipArchive;

class ReferralController extends Controller
{
    use GeneratesSequenceCode;

    public function index() {
        $isPrefect = self::isPrefect() ? 'prefect' : 'other';
        $props = [
            'user' => auth()->user(),
            'students' => User::with(['profile', 'program'])
                            ->where('role', 'student')
                            ->where('id', '!=', auth()->user()->id)
                            ->get(),
            'referral' => self::getAllReferral(),
            'program_name' => is_program_head()
        ];
        $props = !self::isPrefect() ? $props : array_merge($props, [
            'referral_request' => self::getReferralRequest(),
        ]);

        return Inertia::render("$isPrefect/referral", $props);
    }

    public function create() {
        return Inertia::render('referral/report-referral', [
            'user' => auth()->user(),
            'students' => User::with(['profile', 'program'])
                            ->where('role', 'student')
                            ->where('id', '!=', auth()->user()->id)
                            ->get(),
            'back_url' => self::isPrefect() ? '/prefect/referrals' : '/referral',
        ]);
    }

    public function store(StoreReferralRequest $request)
    {
        DB::beginTransaction(); // ✅ Start transaction
        $output = null; // File path tracker for cleanup if fails

        try {

            if(auth()->user()->permissions?->allow_referral != 1) {
                return response()->json([
                    'message' => 'You are being restricted for submitting referral'
                ], 400);
            }

            $field = [
                'program_head_id' => $request->referrer_id,
                'reason_description' => $request->referral_reason,
                'referral_number' => $this->generateSequenceCode(Referral::class, 'referral_number'),
            ];

            // 🧍 If the user is not a sub_admin (prefect)
            if (auth()->user()->role != 'sub_admin') {
                $prefect = User::where('role', 'sub_admin')
                            ->where('activate', true)
                            ->firstOrFail();

                $lastIndex = Referral::insertGetId($field);

                foreach ($request->referred_students as $s) {
                    ReferralReferredStudent::insert([
                        'referral_id' => $lastIndex,
                        'student_id' => $s
                    ]);
                }

                $referral = Referral::with(['user.profile', 'referredStudent.profile'])
                                    ->where('id', $lastIndex)
                                    ->first();

                $name = $referral->user->profile?->first_name;
                $studentName = $referral->referredStudent->profile?->first_name;

                $webpushNotif = [
                    'title' => 'Referral Report',
                    'body' => "$name has reported a referral against $studentName.",
                    'icon' => '',
                    'url' => '',
                ];

                notify_single_user(
                    self::getReferralNotifMessageReportFields($request, $prefect, $lastIndex, $referral),
                    $webpushNotif,
                    new SendReferral($prefect->id)
                );

                ActionLog::create([
                    'user_id' => auth()->user()->id,
                    'action_type' => 'referral',
                    'details' => 'Reports a referral to the prefect'
                ]);

                DB::commit(); // ✅ Everything succeeded
                return response()->json($studentName);
            }

            // 👮 If user is a sub_admin (prefect)
            $prefect = User::with('profile')
                            ->where('role', 'sub_admin')
                            ->firstOrFail();
            $prefectName = trim("{$prefect->profile?->first_name} {$prefect->profile?->middle_name} {$prefect->profile?->last_name}");

            $lastIndex = Referral::insertGetId(array_merge($field, [
                'confirmed_at' => DB::raw('NOW()'),
                'archived_at' => Carbon::parse(now())->addYears(5)
            ]));

            foreach ($request->referred_students as $s) {
                ReferralReferredStudent::insert([
                    'referral_id' => $lastIndex,
                    'student_id' => $s
                ]);
            }

            $referralRecord = Referral::findOrFail($lastIndex);
            $referredStudents = ReferralReferredStudent::with(['referral', 'user.profile', 'user.program', 'user.enrollments'])
                ->where('referral_id', $lastIndex)
                ->get();

            self::generateReferralDocuments($referralRecord, $referredStudents, $prefectName);

            ActionLog::create([
                'user_id' => auth()->user()->id,
                'action_type' => 'referral',
                'details' => 'Reports a referral against a student'
            ]);

            DB::commit(); // ✅ Success
            return self::getAllReferral();

        } catch (\Throwable $e) {
            DB::rollBack(); // ❌ Rollback database changes

            // ❌ If a file was generated before the error, delete it
            if ($output && File::exists($output)) {
                try {
                    File::delete($output);
                    Log::warning("Cleaned up partial referral file: {$output}");
                } catch (\Throwable $cleanupError) {
                    Log::error("Failed to delete partial file after rollback", [
                        'file' => $output,
                        'cleanup_error' => $cleanupError->getMessage()
                    ]);
                }
            }

            Log::error("Referral store failed", [
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);

            return response()->json([
                'message' => 'An error occurred while creating the referral.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getAllReferral() {
        $status = request()->get('status');

        $referrals = Referral::with([
            'user.teachingStaff.program',
            'referredStudent.program'
        ]);

        if(auth()->user()->role != 'sub_admin')   $referrals->where('program_head_id', auth()->user()->id);

        // Filter by confirmation status
        if ($status === 'approve') {
            $referrals->whereNotNull('confirmed_at')->latest('confirmed_at');
        } else {
            $referrals->whereNull('confirmed_at')->latest('created_at');
        }

        return ReferralResource::collection($referrals->paginate(20));
    }
    public function getReferralRequest() {
        return ReferralResource::collection(Referral::with([
                    'user.profile',
                    'user.teachingStaff.program',
                    'referredStudent.profile',
                    'referredStudent.program',
                ])
                ->whereNot('confirmed_at', NULL)
                ->latest('created_at')
                ->get());
    }
    public function confirmReferral($id)  {

        Referral::where('id', $id)->update([
            'confirmed_at'  => now(),
            'archived_at' => Carbon::parse(now())->addYears(5)
        ]);

        $referralRecord = Referral::findOrFail($id);
        $referredStudents = ReferralReferredStudent::with(['referral', 'user.profile', 'user.program', 'user.enrollments'])
            ->where('referral_id', $id)
            ->get();

        $prefect = User::with('profile')->where('role', 'sub_admin')->first();
        $prefectName = "{$prefect->profile?->first_name} {$prefect->profile?->middle_name} {$prefect->profile?->last_name}";

        self::generateReferralDocuments($referralRecord, $referredStudents, $prefectName);

        $referral = Referral::with(['user.profile', 'referredStudent.profile'])->where('id', $id)->first();
        $webpushNotif = [
            'title' => 'Referral Report',
            'body' => "Your Referral Has Already Approved.",
            'icon' => '',
            'url' => '',
        ];

        notify_single_user(
            self::getReferralNotifMessageResponseFields($referral),
            $webpushNotif,
        );
        return self::getAllReferral();
    }
    public function destroy($id)  {
        $referral = Referral::find($id);
        if ($referral) {
            File::deleteDirectory(storage_path("app/private/referrals/referral-{$referral->referral_number}"));
        }
        Referral::where('id',  $id)->delete();
        return self::getAllReferral();
    }

    /**
     * Render one PDF per referred student into the referral's folder.
     * Idempotent — skips a student whose PDF already exists.
     *
     * @return array<int, string> full paths of every student's PDF (existing + newly generated)
     */
    private function generateReferralDocuments(Referral $referral, $referredStudents, string $prefectName): array
    {
        $folder = storage_path("app/private/referrals/referral-{$referral->referral_number}");
        if (!File::isDirectory($folder)) {
            File::makeDirectory($folder, 0755, true);
        }

        $files = [];

        foreach ($referredStudents as $item) {
            $student = $item->user;
            $filePath = "{$folder}/referral-student-{$student->id}-{$referral->referral_number}.pdf";

            if (!file_exists($filePath)) {
                $studentName = trim("{$student->profile?->first_name} {$student->profile?->middle_name} {$student->profile?->last_name}");
                $enrollment = $student->enrollments?->sortByDesc('id')->first();
                $program = trim(($student->program?->name ?? '') . ' ' . ($enrollment?->year_level ?? ''));

                $data = [
                    'date_issued' => Carbon::parse($item->referral->created_at ?? $referral->created_at)->format('F d, Y'),
                    'prefect_name' => $prefectName,
                    'referred_student_name' => $studentName,
                    'program' => $program,
                    'referred_student_id' => $student->id_number,
                    'referral_reason' => $item->referral->reason_description ?? $referral->reason_description,
                ];

                Pdf::loadView('pdf.referral-guidance', $data)->save($filePath);
            }

            $files[] = $filePath;
        }

        return $files;
    }

    public function printReferralGuidance($id)  {
        $referral = Referral::findOrFail($id);
        $referredStudents = ReferralReferredStudent::with(['referral', 'user.profile', 'user.program', 'user.enrollments'])
            ->where('referral_id', $id)
            ->get();

        $prefect = User::with('profile')->where('role', 'sub_admin')->first();
        $prefectName = "{$prefect->profile?->first_name} {$prefect->profile?->middle_name} {$prefect->profile?->last_name}";

        $files = self::generateReferralDocuments($referral, $referredStudents, $prefectName);

        $studentNames = $referredStudents
            ->map(fn($item) => trim("{$item->user->profile?->first_name} {$item->user->profile?->last_name}"))
            ->implode(', ');

        // Email to guidance — one attachment per referred student's PDF
        $guidance = User::where('role', 'guidance')->get();
        foreach ($guidance as $g) {
            $mail = new ReferralMail([
                'prefect_name' => $prefectName,
                'student_names' => $studentNames,
                'date_issued' => Carbon::parse($referral->created_at)->format('F d, Y'),
            ]);
            foreach ($files as $file) {
                $mail->attach($file);
            }
            Mail::to($g->email)->send($mail);
        }

        // Build a temporary, non-persisted zip purely for this download response.
        $zipPath = storage_path('app/private/referrals/tmp-' . uniqid() . '.zip');
        $zip = new ZipArchive();
        $zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);
        foreach ($files as $file) {
            $zip->addFile($file, basename($file));
        }
        $zip->close();

        return response()->download($zipPath, "referral-{$referral->referral_number}.zip")->deleteFileAfterSend(true);
    }

    public function get($id) {
        return new ReferralResource(Referral::with([
                    'user.profile',
                    'user.teachingStaff.program',
                    'referredStudent.profile',
                    'referredStudent.program',
                    'referralReferredStudent.user.profile',
                    'referralReferredStudent.user.program',
                ])
               ->where('id', $id)
               ->first());
    }
    public function getSendReferral() {
        return ReferralResource::collection(Referral::all());
    }
    private function isPrefect() {
        return auth()->user()->role == 'sub_admin';
    }
    private function getReferralNotifMessageReportFields($request, $prefect, $complaintId, $referral) {
        return [
            'notif_type' => 'referral',
            'sender_id' => $request->referrer_id,
            'receiver_id' => $prefect->id,
            'content' => json_decode(json_encode("
            {
                'id': '$complaintId',
                'sender_notif_message': 'You Have Reported A Referral Against {$referral->referredStudent->profile?->first_name}.',
                'receiver_notif_message': '{$referral->user->profile?->first_name} Has Reported A Referral Against {$referral->referredStudent->profile?->first_name}.'
            }
            ")),
            'read_since' => NULL
        ];
    }
    private function getReferralNotifMessageResponseFields($referral, $type = 'confirm', $staff = null) {
        $content = '';

        if($type == 'confirm')
            $content = "
            {
                'id': '{$referral->id}',
                'sender_notif_message': 'You Have Reported A Referral Against {$referral->referredStudent->profile?->first_name}.',
                'receiver_notif_message': 'Your Referral Against {$referral->referredStudent->profile?->first_name} Is Already Approved.'
            }
            ";
        if($type == 'send-guidance')
            $content = "
            {
                'id': '{$referral->id}',
                'sender_notif_message': 'You Have Reported A Referral Against {$referral->referredStudent->profile?->first_name}.',
                'receiver_notif_message': 'The Prefect Sends A Referral Referred By {$referral->user->profile?->first_name}.',
                'document': 'referral-no-{$referral->id}.pdf'
            }
            ";

        return [
            'notif_type' => 'referral',
            'sender_id' => auth()->user()->id,
            'receiver_id' => ($type != 'send-guidance') ? $referral->user->id : $staff,
            'content' => json_decode(json_encode($content)),
            'read_since' => NULL
        ];
    }
}
