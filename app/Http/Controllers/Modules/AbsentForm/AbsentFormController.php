<?php

namespace App\Http\Controllers\Modules\AbsentForm;

use App\Http\Controllers\Controller;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Resource\WebPushController;
use App\Mail\AbsentFormMail;
use App\Models\Absence;
use App\Models\ActionLog;
use App\Models\Notifications;
use App\Models\User;
use App\Traits\GeneratesSequenceCode;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class AbsentFormController extends Controller
{
    use GeneratesSequenceCode;

    public function index() {
        $isPrefect = self::isPrefect() ? 'prefect' : 'student';
        $props = [
            'user' => auth()->user()
        ];
        if(self::isPrefect()) {
            $props = array_merge($props, [
                'absent_form_request_list' => self::getAllAbsentForm()
            ]);
        }

        return Inertia::render("$isPrefect/absent-form", $props);
    }
    public function store(Request $request)
    {
        // Validate input
        $request->validate([
            'date_from' => 'required|date',
            'date_to'   => 'required|date|after_or_equal:date_from',
            'reason'    => 'required|array|min:1',
            'evidence'  => 'required|array|min:1',
            'evidence.*' => 'file|mimes:jpg,jpeg,png|max:2048',
        ]);

        if (auth()->user()->permissions?->allow_absent_form != 1) {
            return response()->json(['message' => 'You are restricted to submit an absent form'], 403);
        }

        $evidenceFiles = $request->file('evidence');
        $formNumber = $this->generateSequenceCode(Absence::class, 'form_number');

        DB::beginTransaction();

        $folder = null; // for cleanup later

        try {

            // Insert DB entry
            $absenceId = Absence::insertGetId([
                'form_number' => $formNumber,
                'student_id' => auth()->user()->id,
                'reason'     => json_encode($request->reason),
                'date_from'  => $request->date_from,
                'date_to'    => $request->date_to,
            ]);

            ActionLog::create([
                'user_id'     => auth()->user()->id,
                'action_type' => 'absent form',
                'details'     => 'submits an absent form to the prefect',
            ]);

            // Create folder + save evidence pictures
            $folder = storage_path('app/private/absent-forms/absent-form-' . $formNumber);
            $evidencesFolder = "{$folder}/evidences";
            File::makeDirectory($evidencesFolder, 0755, true, true);

            $evidences = [];
            $i = 1;
            foreach ($evidenceFiles as $evidenceFile) {
                $extension = $evidenceFile->getClientOriginalExtension();
                $fileName = "{$i}-{$formNumber}.{$extension}";
                $evidenceFile->move($evidencesFolder, $fileName);
                $evidences[] = ['file' => $fileName];
                $i++;
            }

            Absence::where('id', $absenceId)->update(['evidences' => json_encode($evidences)]);

            DB::commit(); // All OK

        } catch (\Exception $e) {

            DB::rollBack(); // rollback database changes

            // DELETE folder if it was created
            if ($folder && File::exists($folder)) {
                File::deleteDirectory($folder);
            }

            return response()->json([
                'message' => 'Failed to submit absent form.',
                'error'   => $e->getMessage()
            ], 500);
        }

        // Notification (best-effort only)
        try {
            $notification = new NotificationController();
            $sender = auth()->user()->profile?->first_name . ' ' . auth()->user()->profile?->last_name;

            $webpushNotif = [
                'title' => "Absent Form Submission!",
                'body'  => "$sender submits an Absent Form",
                'icon'  => Storage::disk('public')->url("profile-pictures/" . auth()->user()->profile?->profile_picture),
                'url'   => url('/prefect/absent-form'),
            ];

            $prefectId = User::where('role', 'sub_admin')->value('id');

            $notification->notifySingleUser(
                self::getAbsentFormSubmissionNotifMessage($absenceId, $prefectId),
                $webpushNotif
            );

        } catch (\Exception $notifyError) {
            Log::error("Notification failed for absence ID $absenceId: " . $notifyError->getMessage());
        }

        return response()->json(['message' => 'success']);
    }

    public function downloadEvidence($id, $fileName) {
        $fileName = basename($fileName);
        $formNumber = Absence::where('id', $id)->value('form_number');
        $path = storage_path("app/private/absent-forms/absent-form-{$formNumber}/evidences/$fileName");

        if (!file_exists($path)) {
            abort(404);
        }

        return response()->file($path, [
            'Content-Type' => mime_content_type($path),
        ]);
    }



    public function confirmAbsentForm($id, Request $request)
    {
        $pdfFile = null;
        DB::beginTransaction();

        try {
            $student = Absence::with(['user.profile', 'user.program', 'user.enrollments'])->findOrFail($id);

            Absence::where('id', $id)->update([
                'confirmed_at' => now(),
                'note'         => $request->note,
                'archived_at'  => now()->addYears(5),
            ]);

            $student->refresh();
            $student->load(['user.profile', 'user.program', 'user.enrollments']);

            ActionLog::create([
                'user_id'     => auth()->user()->id,
                'action_type' => 'absent form',
                'details'     => 'notes and approves the absent form of ' . $student->user->profile?->first_name
            ]);

            // File path setup
            $folderPath = storage_path('app/private/absent-forms/absent-form-' . $student->form_number);
            $pdfPath    = "{$folderPath}/absent-form-approval-{$student->user->id}-{$student->form_number}.pdf";

            if (!is_dir($folderPath)) {
                File::makeDirectory($folderPath, 0755, true, true);
            }

            // --- Generate PDF (must succeed) ---
            $prefectName = auth()->user()->profile?->first_name . ' ' . auth()->user()->profile?->middle_name . ' ' . auth()->user()->profile?->last_name;
            $studentName = $student->user->profile?->first_name . ' ' . $student->user->profile?->middle_name . ' ' . $student->user->profile?->last_name;
            $pdfData = [
                'sender_name' => $studentName,
                'prefect_name' => $prefectName,
                'date_from'    => $student->date_from,
                'date_to'      => $student->date_to,
                'reason'       => implode(', ', json_decode($student->reason, true)),
                'date_approve' => now()->toFormattedDateString(),
                'status' => 'Approved',
                'note'         => $student->note,
                'program'      => $student->user->program?->name,
                'student_id'   => $student->user->id_number
            ];

            try {
                $pdf = Pdf::loadView("pdf.absent-form-approval", $pdfData);
                $pdf->save($pdfPath);
            } catch (\Exception $pdfErr) {
                throw new \Exception("PDF generation error: " . $pdfErr->getMessage());
            }

            // --- Email must succeed ---


            $emailData = [
                'sender_name'  => $prefectName,
                'student_name' => $studentName,
                'prefect_name' => $prefectName,
                'date_from'    => $student->date_from,
                'date_to'      => $student->date_to,
                'reason'       => implode(', ', json_decode($student->reason, true)),
                'confirmed_at' => now()->toFormattedDateString(),
                'file'         => 'absent-forms/absent-form-' . $student->form_number . '/absent-form-approval-' . $student->user->id . '-' . $student->form_number . '.pdf',
            ];

            try {
                Mail::to($student->user->email)
                    ->send(
                        (new AbsentFormMail($emailData))
                            ->attach($pdfPath, [
                                'as'   => 'APPROVED-ABSENT-FORM.pdf',
                                'mime' => 'application/pdf',
                            ])
                    );
            } catch (\Exception $mailErr) {
                throw new \Exception("Email sending error: " . $mailErr->getMessage());
            }
            DB::commit(); // Everything succeeded

        } catch (\Exception $e) {

            DB::rollBack(); // Undo DB changes

            // Cleanup generated PDF if present
            if (isset($pdfPath) && file_exists($pdfPath)) unlink($pdfPath);

            return response()->json([
                'message' => 'Failed to approve absence form.',
                'error'   => $e->getMessage()
            ], 500);
        }

        // --- WebPush (non-critical) ---
        try {
            $notification = new NotificationController();
            $notification->notifySingleUser(
                self::getAbsentFormConfirmationNotifMessage($id, $student->user->id),
                [
                    'title' => "Hello {$student->user->profile?->first_name}",
                    'body'  => "Your Absent Form has been Approved",
                    'icon'  => Storage::disk('public')->url("profile-pictures/" . $student->user->profile?->profile_picture),
                    'url'   => url('/absent-form'),
                ]
            );
        } catch (\Exception $e) {
            Log::error("WebPush failed for absence ID {$id}: " . $e->getMessage());
        }

        return self::getAllAbsentForm();
    }


    public function getAllAbsentFormRequest() {
        return Absence::with(['user.profile', 'user.program', 'user.enrollments'])
                        ->where('confirmed_at', NULL)
                        ->latest('created_at');
    }
    public function getAllAbsentForm() {
        $status = request()->has('status') ? request()->status : null;
        $absence = Absence::with(['user.profile', 'user.program', 'user.enrollments']);

        if ($status === 'req-current') {
            $absence->whereNull('confirmed_at')->whereNull('archived_at')->latest('created_at');
        } elseif ($status === 'noted') {
            $absence->whereNotNull('confirmed_at')->latest('confirmed_at');
        } else {
            $absence->whereNull('confirmed_at')->whereNull('archived_at')->latest('created_at');
        }

        return $absence->paginate(100)->appends(['status' => $status]);
    }
    public function get($id) {
        return Absence::with(['user.profile', 'user.program', 'user.enrollments'])
                        ->where('id', $id)
                        ->first();
    }
    public function cancelAbsentForm(Request $request, $id) {
        $absent = Absence::with('user.profile')->where('id', $id);

        $absent->update([
            'note' => $request->reason,
            'archived_at' => now()->addYears(5),
        ]);
        $record = $absent->first();
        ActionLog::create([
            'user_id' =>  auth()->user()->id,
            'action_type' => 'absent form',
            'details' => 'rejects the absent form of ' . $record->user->profile?->first_name
        ]);
        // --- WebPush (non-critical) ---
        try {
            $notification = new NotificationController();
            $notification->notifySingleUser(
                self::getAbsentFormRejectNotifMessage($id, $record->user->id),
                [
                    'title' => "Hello {$record->user->profile?->first_name}",
                    'body'  => "Your Absent Form has been rejected",
                    'icon'  => Storage::disk('public')->url("profile-pictures/" . $record->user->profile?->profile_picture),
                    'url'   => url('/absent-form'),
                ]
            );
        } catch (\Exception $e) {
            Log::error("WebPush failed for absence ID {$id}: " . $e->getMessage());
        }
        return self::getAllAbsentForm();
    }
    private function isPrefect() {
        return auth()->user()->role == 'sub_admin';
    }
    private function getAbsentFormSubmissionNotifMessage($absentFormId, $receiver) {
        $name = auth()->user()->profile?->first_name . ' ' . auth()->user()->profile?->last_name;
        $sender = auth()->user()->id;

        return [
            'notif_type' => 'absent',
            'sender_id' => $sender,
            'receiver_id' => $receiver,
            'content' => json_decode(json_encode("
            {
                'id': '$absentFormId',
                'sender_notif_message': 'You Have Submitted an Absent Form.',
                'receiver_notif_message': '$name Has Submitted an Absent Form.'
            }
            ")),
            'read_since' => NULL,
        ];
    }
    private function getAbsentFormConfirmationNotifMessage($absentFormId, $receiver) {
        $sender = auth()->user()->id;

        return [
            'notif_type' => 'absent',
            'sender_id' => $sender,
            'receiver_id' => $receiver,
            'content' => json_decode(json_encode("
            {
                'id': '$absentFormId',
                'sender_notif_message': 'You Have Submitted an Absent Form.',
                'receiver_notif_message': 'Your Submitted Absent Form Has Been Approved.'
            }
            ")),
            'read_since' => NULL,
        ];
    }

    private function getAbsentFormRejectNotifMessage($absentFormId, $receiver) {
        $sender = auth()->user()->id;

        return [
            'notif_type' => 'absent',
            'sender_id' => $sender,
            'receiver_id' => $receiver,
            'content' => json_decode(json_encode("
            {
                'id': '$absentFormId',
                'sender_notif_message': 'You Have Submitted an Absent Form.',
                'receiver_notif_message': 'Your Submitted Absent Form Has Been Rejected.'
            }
            ")),
            'read_since' => NULL,
        ];
    }
}
