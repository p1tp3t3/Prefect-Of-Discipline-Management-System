<?php

namespace App\Http\Controllers\Modules\Report;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Modules\Complaint\ComplaintController;
use App\Http\Controllers\Modules\Referral\ReferralController;
use App\Http\Requests\Archive\DestroyDocumentRequest;
use App\Http\Requests\Archive\RecoverDocumentRequest;
use App\Http\Resources\ArchivedDocumentResource;
use App\Mail\AbsentFormMail;
use App\Models\Absence;
use App\Models\Complaint;
use App\Models\Referral;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use ZipArchive;
use Illuminate\Support\Str;

class ArchiveController extends Controller
{
    public function index() {
        return Inertia::render('prefect/archive', [
            'user' => auth()->user(),
            'document' => self::getDocuments()
        ]);
    }
    public function archive(Request $request) {
        $getUpdatedList = self::iterateDocument($request, 'archive');
        return response()->json($getUpdatedList);
    }
    public function destroy(DestroyDocumentRequest $request) {
        $id = $request->id;
        $doc = null;

        switch($request->type) {
            case 'complaint':
                $doc = Complaint::where('id', $id);
                $docName = storage_path("app/private/complaints/complaint-{$doc->value('complaint_number')}");

                if(File::exists($docName)) {
                    File::deleteDirectory($docName);
                }
                $doc->delete();

                return self::getDocuments();
            case 'referral':
                $doc = Referral::where('id', $id);
                $docName = storage_path("app/private/referrals/referral-{$doc->value('referral_number')}");

                if(File::exists($docName)) {
                    File::deleteDirectory($docName);
                }
                $doc->delete();
                return self::getDocuments();
            case 'absent form':
                $doc = Absence::where('id', $id);
                $docName = storage_path("app/private/absent-forms/absent-form-{$doc->value('form_number')}");

                if(File::exists($docName)) {
                    File::deleteDirectory($docName);
                }
                $doc->delete();
                return self::getDocuments();
        }
    }
    private function iterateDocument($request, $action) {
        $getUpdatedList = null;
        if($action == 'transfer') {
            if($request->has('doc_list')) {
                foreach($request->doc_list as $docId) {
                    if($request->type == 'complaint') {
                        $complaint = new ComplaintController();
                        Complaint::where('case_number', $docId)->update(['archived_at' => now()]);
                        $getUpdatedList = $complaint->allComplaints();
                    }
                    else if($request->type == 'referral') {
                        $referral = new ReferralController();
                        Referral::where('id', $docId)->update(['archived_at' => now()]);
                        $getUpdatedList = $referral->getAllReferral();
                    }
                }
            }else {
                if($request->type == 'complaint') {
                    $complaint = new ComplaintController();
                    Complaint::where('case_number', $request->doc_id)->update(['archived_at' => now()]);
                    $getUpdatedList = $complaint->allComplaints();
                }
                else if($request->type == 'referral') {
                    $referral = new ReferralController();
                    Referral::where('id', $request->doc_id)->update(['archived_at' => now()]);
                    $getUpdatedList = $referral->getAllReferral();
                }
            }
        }else if($action == 'archive') {
            if($request->has('doc_list')) {

            }
        }
        return $getUpdatedList;
    }
    public function recoverDocument(RecoverDocumentRequest $request) {
        if($request->type == 'complaint') {
            // Safely get the latest case number
            $lastCaseNumber = Complaint::whereNotNull('case_number')
                                        ->orderByDesc('case_number')
                                        ->value('case_number');

            // If no previous record, start at 1
            $nextCaseNumber = ($lastCaseNumber ?? 0) + 1;
            Complaint::where('id', $request->id)->update([
                'archived_at' => NULL,
                'rejected_reason' => NULL,
                'complaint_status' => 'ongoing',
                'case_number' => $nextCaseNumber
            ]);
            $complaint = Complaint::with('user.profile')->where('id', $request->id)->first();

            $webpushNotif = [
                'title' => 'Complaint Recovered',
                'body'  => 'Your complaint has been recovered from archive and is now ongoing.',
                'url'   => '/student/complaint/view/' . $complaint->id,
            ];

            notify_single_user(
                [
                    'sender_id'   => auth()->user()->id,
                    'receiver_id' => $complaint->user->id,
                    'type'        => 'complaint',
                    'content'     => json_encode([
                        'sender_id'   => auth()->user()->id,
                        'receiver_id' => $complaint->user->id,
                        'message'     => 'Your complaint has been recovered from archive and is now ongoing.',
                    ]),
                ],
                $webpushNotif
            );

        }if($request->type == 'referral') {

        }if($request->type == 'absent form') {
            Absence::where('id', $request->id)->update([
                'archived_at' => NULL,
            ]);
            $student = Absence::with(['user.profile', 'user.program'])->where('id', $request->id)->first();


            //generate pdf file with watermark as approved absent form
            // File path setup
            $folderPath = storage_path('app/private/absent-forms/absent-form-' . $student->form_number);
            $pdfPath    = $folderPath . '/absent-form-approval-' . $student->user->id . '-' . $student->form_number . '.pdf';

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
        }

        return self::getDocuments();
    }

    public function getDocuments($type = 'paginate')
    {
        $filterType = request()->input('type', 'all');
        $search = strtolower(request()->input('search', ''));

        // -----------------------
        // 1. COMPLAINT
        // -----------------------
        $complaint = Complaint::with([
                'user.profile',
                'subject.profile',
                'subject.program',
                'subject.enrollments',
                'subject.teachingStaff.program',
                'complaintSubject.user.profile',
                'complaintSubject.user.program',
                'complaintSubject.user.enrollments',
                'complaintSubject.user.teachingStaff.program'
            ])
            ->whereNotNull('archived_at')
            ->get();

        $complaint->each(function ($item) {
            $item->usr = $item->user;
            unset($item->user);

            $item->student = $item->subject;
            $item->students = $item->complaintSubject;
            unset($item->subject);

            $item->type = 'complaint';
        });


        // -----------------------
        // 2. REFERRAL
        // -----------------------
        $referral = Referral::with([
                'user.profile',
                'referredStudent.profile',
                'referredStudent.program',
                'referredStudent.enrollments',
                'referralReferredStudent.user.profile',
                'referralReferredStudent.user.program',
                'referralReferredStudent.user.enrollments'
            ])
            ->whereNotNull('archived_at')
            ->get();

        $referral->each(function ($item) {
            $item->usr = $item->user;
            unset($item->user);

            $item->student = $item->referredStudent;
            $item->students = $item->referralReferredStudent;
            unset($item->referredStudent);

            $item->type = 'referral';
        });


        // -----------------------
        // 3. ABSENT FORM
        // -----------------------
        $absent = Absence::with(['user.profile', 'user.program', 'user.enrollments'])
            ->whereNotNull('archived_at')
            ->get();

        $absent->each(function ($item) {
            $item->student = $item->user;
            unset($item->user);

            $item->type = 'absent form';
        });


        // -----------------------
        // 4. MERGE
        // -----------------------
        $merged = $complaint
            ->concat($referral)
            ->concat($absent)
            ->sortByDesc('archived_at')
            ->values();


        // -----------------------
        // 5. FILTER BY TYPE
        // -----------------------
        if ($filterType !== 'all') {
            $merged = $merged->filter(function ($item) use ($filterType) {
                return strtolower($item->type) === strtolower($filterType);
            })->values();
        }

        // -----------------------
        // 6. SEARCH FILTER
        // -----------------------
        if (!empty($search)) {

            $search = trim(strtolower($search));
            $parts = explode(' ', $search);

            $merged = $merged->filter(function ($item) use ($search, $parts) {

                /* 1️⃣ COMPLAINT */
                if ($item->type === 'complaint' && isset($item->students)) {
                    foreach ($item->students as $studItem) {
                        $user = $studItem->user ?? null;
                        if ($user && self::matchStudentSearch($user, $search, $parts)) {
                            return true;
                        }
                    }
                }

                /* 2️⃣ REFERRAL */
                if ($item->type === 'referral' && isset($item->students)) {
                    foreach ($item->students as $studItem) {
                        $user = $studItem->user ?? null;
                        if ($user && self::matchStudentSearch($user, $search, $parts)) {
                            return true;
                        }
                    }
                }

                /* 3️⃣ ABSENT FORM */
                if ($item->type === 'absent form' && isset($item->student)) {
                    $user = $item->student ?? null;
                    if ($user && self::matchStudentSearch($user, $search, $parts)) {
                        return true;
                    }
                }

                return false;
            })->values();
        }




        $paginated = $merged;
        if($type == 'paginate') {
            // -----------------------
            // 6. PAGINATION
            // -----------------------
            $page = request()->input('page', 1);
            $perPage = request()->input('per_page', 10);
            $offset = ($page - 1) * $perPage;

            $paginated = new \Illuminate\Pagination\LengthAwarePaginator(
                $merged->slice($offset, $perPage)->values(),
                $merged->count(),
                $perPage,
                $page,
                [
                    'path' => request()->url(),
                    'query' => request()->query()
                ]
            );
        }

        return ArchivedDocumentResource::collection($paginated);
    }
    public function matchStudentSearch($user, $search, $parts)
    {
        $profile = $user->profile;
        $first  = strtolower($profile->first_name ?? '');
        $middle = strtolower($profile->middle_name ?? '');
        $last   = strtolower($profile->last_name ?? '');
        $userId = strtolower($user->id_number ?? '');

        $full1 = trim("$first $middle $last");
        $full2 = trim("$first $last");
        $full3 = trim("$last $first");

        // ---------- Single-word search ----------
        if (count($parts) === 1) {
            if (
                str_contains($first, $search) ||
                str_contains($middle, $search) ||
                str_contains($last, $search) ||
                str_contains($userId, $search)
            ) {
                return true;
            }
        }

        // ---------- Two-word search ----------
        if (count($parts) === 2) {
            [$p1, $p2] = $parts;

            if (
                str_contains($full2, "$p1 $p2") ||
                str_contains($full3, "$p1 $p2") ||
                (str_contains($first, $p1) && str_contains($last, $p2)) ||
                (str_contains($last, $p1) && str_contains($first, $p2))
            ) {
                return true;
            }
        }

        // ---------- Three or more ----------
        if (
            str_contains($full1, $search) ||
            str_contains($full2, $search) ||
            str_contains($full3, $search)
        ) {
            return true;
        }

        return false;
    }

    public function downloadDocument($type, $id)
    {
        switch ($type) {

            case 'complaint':
                $doc = Complaint::findOrFail($id);
                $folderPath = storage_path("app/private/complaints/complaint-{$doc->complaint_number}");
                $zipName = "complaint-files-{$doc->complaint_number}.zip";
                break;

            case 'referral':
                $doc = Referral::findOrFail($id);
                $folderPath = storage_path("app/private/referrals/referral-{$doc->referral_number}");
                $zipName = "referral-files-{$doc->referral_number}.zip";
                break;

            case 'absent form': // allow both
                $doc = Absence::findOrFail($id);
                $folderPath = storage_path("app/private/absent-forms/absent-form-{$doc->form_number}");
                $zipName = "absence-files-{$doc->form_number}.zip";
                break;

            default:
                abort(404, "Invalid type.");
        }

        if (!is_dir($folderPath)) {
            abort(404, "Document folder not found.");
        }

        // Create ZIP in temp directory
        $tempZipPath = storage_path("app/temp/" . Str::random(20) . ".zip");

        if (!file_exists(dirname($tempZipPath))) {
            mkdir(dirname($tempZipPath), 0775, true);
        }

        $zip = new ZipArchive;
        if ($zip->open($tempZipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            abort(500, "Cannot create ZIP file.");
        }

        // Add all files inside folder
        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($folderPath, \FilesystemIterator::SKIP_DOTS)
        );

        foreach ($files as $file) {
            $filePath = $file->getRealPath();
            $relativePath = substr($filePath, strlen($folderPath) + 1);
            $zip->addFile($filePath, $relativePath);
        }

        $zip->close();

        // Download + delete after response finishes
        return response()->download($tempZipPath, $zipName)->deleteFileAfterSend(true);
    }
}
