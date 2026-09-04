<?php

namespace App\Http\Controllers\Modules\Complaint;

use App\Events\SendComplaint;
use App\Events\SendComplaintConfirmation;
use App\Http\Controllers\Controller;
use App\Http\Requests\Complaint\BulkComplaintActionRequest;
use App\Http\Requests\Complaint\CancelComplaintRequest;
use App\Http\Requests\Complaint\StoreComplaintRequest;
use App\Http\Resources\ComplaintResource;
use App\Models\ActionLog;
use App\Models\Complaint;
use App\Models\ComplaintSubject;
use App\Models\Program;
use App\Models\User;
use App\Models\Violation;
use App\Traits\GeneratesSequenceCode;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    use GeneratesSequenceCode;

    public function index() {
        $prefect = (!self::isPrefect()) ? 'other' : 'prefect';
        $complaints = self::isPrefect()
                    ? self::allComplaints()
                    :  self::allUserComplaint();
        $props = [
            'user' => auth()->user(),
            'program' => Program::latest('id')
                                ->get(['id', 'name']),
            'students' => User::with(['profile', 'program'])
                            ->where('role', 'student')
                            ->where('id', '!=', auth()->user()->id)
                            ->get(),
            'program_name' => is_program_head(),
            'complaint_list' => $complaints,
            'incident_list' => Violation::select([DB::raw('id AS val'), DB::raw('violation_name AS label')])->get(),
        ];
        if(self::isPrefect()) {
            $props = array_merge($props, [
                'reported_complaint_list' => Complaint::with('user.profile')
                                             ->where('confirmed_at', NULL)
                                             ->latest('created_at')
                                             ->get(),
                'violation_list' => Violation::select('id', 'violation_name', 'offense_status')
                                            ->latest('created_at')
                                            ->get(),
                'all_users' => User::with('profile')->get()
            ]);
        }

        return Inertia::render("$prefect/complaint", $props);
    }
    public function store(StoreComplaintRequest $request) {
        DB::beginTransaction(); // start transaction
        try {
            $isPrefect = self::isPrefect();
            $complainant = User::with('profile')->where('id', $request->complainant)->first();
            $profile = ($complainant && $complainant->profile?->profile_picture)
                    ? Storage::disk('public')->url("profile-pictures/{$complainant->profile->profile_picture}")
                    : asset("default-pic/profile-" . ($complainant?->profile?->sex === 'f' ? 'f' : 'm') . "-pic.jpg");
            $prefect = User::where('role', 'sub_admin')
                                    ->where('activate', true);
            $lastIndex = null;

            if (auth()->user()->permissions?->allow_complaint != 1)
                return response()->json(['message' => 'You are restricted to report a complaint.'], 400);
            if (!$prefect->exists() && !$isPrefect)
                return response()->json(['message' => 'The prefect is not available in the system.'], 400);



            if (!$isPrefect) {
                $prefect = $prefect->first();
                $lastIndex = self::generateComplaint($request);  // <-- creates complaint

                $complaintNotif = Complaint::with(['user.profile', 'subject.profile'])
                                        ->where('id', $lastIndex)
                                        ->first();
                $complaintNotifField = self::getComplaintNotifMessageReportFields(
                    $request,
                    $prefect,
                    $lastIndex,
                    $complaintNotif
                );
                $webpushNotif = [
                    'title' => "Complaint Report!!!",
                    'body' => "{$complaintNotif->user->profile?->first_name} Reported a Complaint on {$complaintNotif->subject->profile?->first_name}",
                    'icon' => $profile,
                    'url' => url('/prefect/complaint'),
                ];

                notify_single_user(
                    $complaintNotifField,
                    $webpushNotif,
                    new SendComplaint($prefect->id)
                );

                ActionLog::create([
                    'user_id' =>  auth()->user()->id,
                    'action_type' => 'complaint',
                    'details' => 'reports a complaint to the prefect'
                ]);

                DB::commit(); // ✅ commit here — success
                return response()->json(['message' => $lastIndex]);

            } else {

                $prefect = $prefect->first();
                $lastIndex = self::generateComplaint($request);

                if ($request->complainant != NULL) {
                    $complaint = Complaint::with(['user.profile', 'subject.profile', 'complaintSubject.user.profile'])
                                    ->where('id', $lastIndex)
                                    ->first();
                    if (($request->has('complainant_name') && $request->complainant_name == '' && is_null($request->complainant_name) && $isPrefect)) {
                        $complaintNotifField = self::getComplaintNotifMessageResponseFields($complaint);
                        $webpushNotif = [
                            'title' => "Complaint Report!!!",
                            'body' => "{$complaint->user->profile?->first_name} Reported a Complaint on {$complaint->subject->profile?->first_name}",
                            'icon' => $profile,
                            'url' => url('/complaints'),
                        ];

                        notify_single_user(
                            $complaintNotifField,
                            $webpushNotif
                        );
                    }
                }

                ActionLog::create([
                    'user_id' =>  auth()->user()->id,
                    'action_type' => 'complaint',
                    'details' => 'reports a direct complaint against a student'
                ]);

                DB::commit(); // ✅ commit here — success
                return response()->json(['complaint' => self::allComplaints(), 'req' => self::getComplaintInsertFields($request, self::isPrefect())]);
            }

        } catch (Exception $e) {
            DB::rollBack(); // ❌ rollback on any error

            // Clean up — remove complaint folder if created
            if (!empty($lastIndex)) {
                $complaintNumber = Complaint::where('id', $lastIndex)->value('complaint_number');
                $complaintFolderPath = storage_path("app/private/complaints/complaint-{$complaintNumber}");
                if (File::exists($complaintFolderPath)) {
                    File::deleteDirectory($complaintFolderPath);
                }
            }
            Log::error('Error processing complaint: ' . $e->getMessage());

            return response()->json(['message' => 'Error processing complaint', 'error' => $e->getMessage(), 'line' => $e->getLine(),
                'file' => $e->getFile()], 500);
        }
    }
    private function generateComplaint($request) {
        $evidence = $request->file('evidence');

        $lastIndex = Complaint::insertGetId(self::getComplaintInsertFields($request, self::isPrefect()));
        $complaintNumber = Complaint::where('id', $lastIndex)->value('complaint_number');

        foreach($request->student_subjects as $s) {
            ComplaintSubject::insert([
                'complaint_id' => $lastIndex,
                'student_id' => $s
            ]);
        }

        $complaintFolderPath = storage_path("app/private/complaints/complaint-{$complaintNumber}");
        File::deleteDirectory($complaintFolderPath);
        File::makeDirectory("{$complaintFolderPath}/subjects", 0755, true);
        File::makeDirectory("{$complaintFolderPath}/evidences", 0755, true);

        if($evidence) {
            $evidencesFolder = "{$complaintFolderPath}/evidences";
            $json = [];
            $i = 1;

            foreach($evidence as $e) {
                $extension = $e->getClientOriginalExtension();
                $type = str_contains($e->getMimeType(), 'image') ? 'pic' : 'vid';
                $fileName = "{$i}-{$complaintNumber}.{$extension}";

                $e->move($evidencesFolder, $fileName);
                $json[] = ['type' => $type, 'file' => $fileName];
                $i++;
            }
            Complaint::where('id', $lastIndex)->update(['complaint_evidences' => json_encode($json)]);
        }

        return $lastIndex;
    }

    public function downloadEvidence($id, $fileName) {
        $fileName = basename($fileName);
        $complaintNumber = Complaint::where('id', $id)->value('complaint_number');
        $path = storage_path("app/private/complaints/complaint-{$complaintNumber}/evidences/$fileName");

        if (!file_exists($path)) {
            abort(404);
        }

        return response()->file($path, [
            'Content-Type' => mime_content_type($path),
        ]);
    }

    public function downloadSubjectDocument($id, $fileName) {
        $fileName = basename($fileName);
        $complaintNumber = Complaint::where('id', $id)->value('complaint_number');
        $path = storage_path("app/private/complaints/complaint-{$complaintNumber}/subjects/$fileName");

        if (!file_exists($path)) {
            abort(404);
        }

        return response()->file($path, [
            'Content-Type' => mime_content_type($path),
        ]);
    }


    public function confirmComplaint($id) {
        $complaint = Complaint::with(['user.profile', 'subject.profile'])
                              ->where('id', $id)
                              ->first();
        $complainantName = $complaint->user->profile?->first_name;
        $webpushNotif = [
            'title' => "Complaint Report!!!",
            'body' => "{$complaint->user->profile?->first_name} Report An Complaint {$complaint->subject->profile?->first_name}",
            'icon' => '',
            'url' => url('/complaints')
        ];
        $complaint2 = $complaint;

        $count = Complaint::select('case_number')->whereNotNull('case_number')->latest('case_number')->value('case_number') + 1;
        $complaint = self::getComplaintNotifMessageResponseFields($complaint);
        $complaintNotifField = self::getComplaintNotifMessageResponseFields($complaint2);


        Complaint::where('id', $id)
                 ->update([
                        'case_number' => $count,
                        'confirmed_at' => DB::raw('NOW()'),
                        'complaint_status' => 'ongoing'
                 ]);
        notify_single_user(
            $complaintNotifField,
            $webpushNotif,
            new SendComplaintConfirmation(self::getSentComplaints())
        );
        if(self::isPrefect()) {
            return response()->json([
                'complaint' => self::allComplaints()
            ]);
        }else {
            ActionLog::create([
                'user_id' =>  auth()->user()->id,
                'action_type' => 'complaint',
                'details' => 'approves the complaint of ' . $complainantName
            ]);
        }
        return response()->json([
            'complaint' => self::allComplaints()
        ]);
    }


    public function cancelComplaint(CancelComplaintRequest $request, $id) {

        DB::beginTransaction();
        try {
            $complaint = Complaint::with(['user.profile', 'subject.profile'])
                              ->where('id', $id);
            $complaint->update([
                'complaint_status' => 'rejected',
                'rejected_reason' => $request->reason,
                'rejected_at' => now(),
                'archived_at' => Carbon::parse(now())->addYears(5)
            ]);

            $complaint = $complaint->first();
            $complainantName = $complaint->user->profile?->first_name;
            $complaintNotifField = self::getComplaintNotifMessageResponseFields($complaint, 'rejected');
            $webpushNotif = [
                'title' => "Complaint Report!!!",
                'body' => "Your Complaint Against {$complaint->subject->profile?->first_name} {$complaint->subject->profile?->last_name} Has Been Rejected",
                'icon' => '',
                'url' => url('/complaints')
            ];


            notify_single_user(
                $complaintNotifField,
                $webpushNotif,
                new SendComplaintConfirmation(self::getSentComplaints())
            );
            ActionLog::create([
                'user_id' =>  auth()->user()->id,
                'action_type' => 'complaint',
                'details' => 'rejects the complaint of ' . $complainantName
            ]);
            DB::commit();
            return response()->json([
                'complaint' => self::allComplaints()
            ]);
        }catch(Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error processing complaint', 'error' => $e->getMessage()], 500);
        }
    }


    public function actionMultipleSelect(BulkComplaintActionRequest $request)
    {
        $ids = $request->ids; // array of complaint IDs

        DB::beginTransaction();

        try {
            $action = $request->action;
            $processedCount = 0; // number of successfully processed complaints
            $userNames = [];     // list of complainant first names for log usage

            switch ($action) {
                case 'approve':
                    foreach ($ids as $id) {
                        $complaint = Complaint::with(['user.profile', 'subject.profile'])->find($id);
                        if (!$complaint) continue;

                        $count = Complaint::whereNotNull('case_number')
                                        ->latest('case_number')
                                        ->value('case_number') ?? 0;
                        $count++;

                        Complaint::where('id', $id)->update([
                            'case_number' => $count,
                            'confirmed_at' => DB::raw('NOW()'),
                            'complaint_status' => 'ongoing'
                        ]);

                        $webpushNotif = [
                            'title' => "Complaint Approved",
                            'body'  => "Your complaint against {$complaint->subject->profile?->first_name} {$complaint->subject->profile?->last_name} is now under investigation.",
                            'icon'  => '',
                            'url'   => url('/complaints')
                        ];

                        notify_single_user(
                            self::getComplaintNotifMessageResponseFields($complaint),
                            $webpushNotif,
                        );

                        $userNames[] = $complaint->user->profile?->first_name;
                        $processedCount++;
                    }

                    // Single ActionLog
                    ActionLog::create([
                        'user_id' => auth()->user()->id,
                        'action_type' => 'complaint',
                        'details' => "approved {$processedCount} complaint(s): " . implode(', ', $userNames)
                    ]);
                    break;


                case 'reject':
                    foreach ($ids as $id) {
                        $complaint = Complaint::with(['user.profile', 'subject.profile'])->find($id);
                        if (!$complaint) continue;

                        Complaint::where('id', $id)->update([
                            'complaint_status' => 'rejected',
                            'rejected_at' => now(),
                            'archived_at' => Carbon::now()->addYears(5)
                        ]);

                        $webpushNotif = [
                            'title' => "Complaint Rejected",
                            'body'  => "Your complaint against {$complaint->subject->profile?->first_name} {$complaint->subject->profile?->last_name} has been rejected.",
                            'icon'  => '',
                            'url'   => url('/complaints')
                        ];

                        notify_single_user(
                            self::getComplaintNotifMessageResponseFields($complaint, 'rejected'),
                            $webpushNotif,
                        );

                        $userNames[] = $complaint->user->profile?->first_name;
                        $processedCount++;
                    }

                    // Single ActionLog
                    ActionLog::create([
                        'user_id' => auth()->user()->id,
                        'action_type' => 'complaint',
                        'details' => "rejected {$processedCount} complaint(s): " . implode(', ', $userNames)
                    ]);
                    break;


                default:
                    return response()->json(['message' => 'Invalid action'], 400);
            }

            DB::commit();

            return response()->json([
                'complaint' => self::allComplaints()
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error processing bulk action',
                'error'   => $e->getMessage()
            ], 500);
        }
    }


//-------------------------------------------------------------------------------------------------------------------------------------


    private function checkComplaintLimit($userId) {

        $complaint = Complaint::where('complainant_id', $userId)
                              ->where(DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d')"), DB::raw("DATE_FORMAT(NOW(), '%Y-%m-%d')"))
                              ->count();

        return $complaint > 10;
    }
    public function allComplaints() {
        $status = isset($_GET['status']) ? $_GET['status'] : 'ongoing';
        $data = Complaint::whereIn('complaint_status', ['pending', 'ongoing', 'resolved'])
                         ->with(['user.profile', 'subject.profile', 'subject.program', 'complaintSubject.user.profile', 'complaintSubject.user.program']);
        $search = $_GET['search'] ?? null;
        $date = $_GET['date'] ?? null;
        $year   = $_GET['year'] ?? null;  // ✅ new filter
        $role   = $_GET['role'] ?? null;  // ✅ new filter

        $appendList = [
            'status' => $status,
            'search' => $search,
            'date' => $date,
            'year' => $year,
            'role' => $role
        ];



        if (request()->has('date')) {
            $data->whereDate('created_at', $_GET['date']);
        }
        if ($search) {
            $data->whereHas('user', function ($q) use ($search) {
                $q->where("id_number", 'like', "%$search%");
            });
        }
        if ($role != 'all' && !is_null($role)) {
            $data->whereHas('user', function ($q) use ($role) {
                $q->where('role', $role);
            });
        }
        if ($year != 'all' && !is_null($year)) {
            [$startYear, $endYear] = explode('-', $year);

            $data->whereBetween(DB::raw("YEAR(created_at)"), [$startYear, $endYear]);
        }
        if(isset($_GET['status']) && in_array($_GET['status'], ['pending', 'ongoing'])) {
            $data = (auth()->user()->role == 'sub_admin')
                    ? $data->where('complaint_status', $status)
                           ->whereNull('archived_at')
                    : $data->whereNull('archived_at');
        }else {
            $data = $data->whereNull('archived_at');
        }

        $data = (isset($_GET['status']) && in_array($_GET['status'], ['rejected', 'pending']))
                ?
                $data->latest('created_at')
                :
                $data->latest('confirmed_at');

        return ['data' => ComplaintResource::collection($data->get())];
    }
    public function allUserComplaint() {
        $data = Complaint::where('complainant_id', auth()->user()->id);
        $status = isset($_GET['status']) ? $_GET['status'] : null;

        if(isset($_GET['status']) && in_array($_GET['status'], ['pending', 'ongoing', 'rejected', 'resolved'])) {
            $data = $data->where('complaint_status', $status)
                           ->latest('created_at');
        } else {
            $data = $data->latest('created_at');
        }


        return ['data' => ComplaintResource::collection($data->get())];
    }
    public function isPrefect() {
        return (auth()->user()->role == 'sub_admin');
    }
    public function getSentComplaints() {
        return Complaint::with('user.profile')
                        ->whereNull('confirmed_at')
                        ->whereNull('archived_at')
                        ->latest('created_at')
                        ->get()
                        ->toArray();
    }
    private function getComplainantComplaint($id) {
        return Complaint::with('user.profile')
                        ->where('complainant_id', $id)
                        ->latest('created_at')
                        ->get()
                        ->toArray();
    }
    public function get($id) {
        $complaint = Complaint::with([
                        // COMPLAINT OWNER (User)
                        'user.profile',
                        'user.program',
                        'user.teachingStaff.program',
                        'user.parent',

                        // SUBJECTS + USER + STUDENT + PROGRAM
                        'subject.profile',
                        'subject.program',
                        'subject.teachingStaff.program',
                        'complaintSubject.user.profile',
                        'complaintSubject.user.program',
                        'complaintSubject.user.teachingStaff.program',

                        // SUBJECT OFFENSES + VIOLATION DETAILS
                        'complaintSubjectViolation.violation',
                        'violation',
                    ])
                    ->where('id', $id)
                    ->first();


        if(auth()->user()->role == 'sub_admin') {
            $api = Http::withoutVerifying()->post('https://pitpete-violation-risk-predictor-api.hf.space/python/complaint/context', [
                'complaint_text' => $complaint->complaint_description
            ]);
            $predictions = $api->successful() ? $api->json() : [];
            $complaint->context_analysis = $predictions['data'] ?? [];
        }
        return new ComplaintResource($complaint);
    }
    private function getComplaintInsertFields($request, $isPrefect)
    {
        // Safely get the latest case number
        $lastCaseNumber = Complaint::whereNotNull('case_number')
            ->orderByDesc('case_number')
            ->value('case_number');

        $nextCaseNumber = ($lastCaseNumber ?? 0) + 1;

        // Determine complainant_id
        $complainantId = null;
        if (!$request->has('complainant_name') || is_null($request->complainant_name)) {
            $complainantId = $request->complainant;
        }

        $fields = [
            'complaint_number'      => self::generateComplaintNumber(),
            'complainant_id'        => $complainantId,
            'incident_id'           => $request->incident_id,
            'complaint_description' => $request->complaint_description,
            'complaint_status'      => $isPrefect ? 'ongoing' : 'pending',
            'confirmed_at'          => $isPrefect ? now() : null,
            'case_number'           => $isPrefect ? $nextCaseNumber : null,
        ];

        if ($request->has('complainant_name') && !empty($request->complainant_name)) {
            $fields['complainant_name'] = $request->complainant_name;
        }

        return $fields;
    }

    private function generateComplaintNumber()
    {
        return $this->generateSequenceCode(Complaint::class, 'complaint_number');
    }

    public function getComplaintDocumentField($newComplaint, $summary)
    {
        // Determine complainant name dynamically
        $complainantName = null;

        if (!is_null($newComplaint->user)) {
            // Registered user in the system
            $profile = $newComplaint->user->profile;
            $complainantName = trim(
                ($profile->first_name ?? '') . ' ' .
                ($profile->middle_name ?? '') . ' ' .
                ($profile->last_name ?? '')
            );
        } else {
            // Not in the system — use stored text field
            $complainantName = $newComplaint->complainant_name ?? 'N/A';
        }

        $subjectProfile = $newComplaint->subject?->profile;

        return [
            'id' => $newComplaint->id,
            'case_number' => $newComplaint->case_number,
            'complainant_name' => $complainantName,
            'complainant_user_type' => strtoupper(optional($newComplaint->user)->role ?? 'EXTERNAL'),
            'subject_name' => trim(
                ($subjectProfile->first_name ?? '') . ' ' .
                ($subjectProfile->middle_name ?? '') . ' ' .
                ($subjectProfile->last_name ?? '')
            ),
            'subject_user_type' => strtoupper(optional($newComplaint->subject)->role ?? 'STUDENT'),
            'incident' => $newComplaint->violation?->violation_name,
            'incident_summary' => $summary,
            'date_issued' => Carbon::parse($newComplaint->created_at)->format('F j, Y'),
        ];
    }

    private function getComplaintNotifMessageReportFields($request, $prefect, $complaintId, $complaintNotif)
    {
        $subjectDisplay = $this->formatComplaintSubjectNames($complaintNotif);

        return [
            'notif_type'  => 'complaint',
            'sender_id'   => $request->complainant,
            'receiver_id' => $prefect->id,
            'content'     => json_encode([
                'id'                     => $complaintId,
                'sender_notif_message'   => "You have reported a complaint against {$subjectDisplay}.",
                'receiver_notif_message' => "{$complaintNotif->user->profile?->first_name} has reported a complaint against {$subjectDisplay}."
            ]),
            'read_since' => null
        ];
    }

    private function getComplaintNotifMessageResponseFields($complaint, $res = 'success')
    {
        $subjectDisplay = $this->formatComplaintSubjectNames($complaint);

        $receiverMessage = ($res === 'success')
            ? "Your complaint against {$subjectDisplay} is now under investigation."
            : "Your complaint against {$subjectDisplay} has been rejected.";

        return [
            'notif_type'  => 'complaint',
            'sender_id'   => auth()->user()->id,
            'receiver_id' => optional($complaint->user)->id,
            'content'     => json_encode([
                'id'                     => $complaint->id,
                'sender_notif_message'   => "",
                'receiver_notif_message' => $receiverMessage
            ]),
            'read_since' => null
        ];
    }

    private function formatComplaintSubjectNames($complaint)
    {
        $subjects = $complaint->complaintSubject;
        $subject = $complaint->subject;

        if (sizeOf($subjects) === 0) {
            return "the student";
        }

        if (sizeOf($subjects) === 1) {
            $s = $subject?->profile;
            return trim("{$s?->first_name} {$s?->last_name}");
        }

        if (sizeOf($subjects) === 2) {
            return $subjects
                ->map(fn($s) => trim(($s->user->profile?->first_name ?? '') . ' ' . ($s->user->profile?->last_name ?? '')))
                ->implode(' and ');
        }

        return sizeOf($subjects) . " students";
    }
}
