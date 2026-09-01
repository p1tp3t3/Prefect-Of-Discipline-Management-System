<?php

namespace App\Http\Controllers\Modules\Appointment;

use App\Http\Controllers\Controller;
use App\Http\Controllers\NotificationController;
use App\Mail\AppointmentMail;
use App\Models\ActionLog;
use App\Models\Appointment;
use App\Models\AppointmentSlot;
use App\Models\FamilyMember;
use App\Models\Notifications;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AppointmentController extends Controller
{
    public function index(Request $request) {
        $isPrefect = (auth()->user()->role == 'sub_admin') ? 'prefect' : 'other';
        $props = [
            'user' => auth()->user(),
            'appointment_list' => self::getAppointment($request),
            'user_upcoming_appointment' => (auth()->user()->role != 'sub_admin') ? self::getUpcomingAppointmentList(auth()->user()->id) : null
        ];
        if(auth()->user()->role == 'sub_admin') {
            $props = array_merge($props, [
                'appointment_request_list' => null,
                'student_parent_list' => User::with('profile')->whereIn('role', ['student', 'parent'])->get()
            ]);
        }
        return Inertia::render("$isPrefect/appointment2",  $props);
    }
    public function updateAppointmentSlot(Request $request) {
        if(!empty($request->date_to)) {
            $period = CarbonPeriod::create($request->date_from, $request->date_to);

            foreach($period as $date) {
                AppointmentSlot::updateOrInsert([
                    'date_available' => $date->toDateString()
                ], [
                    'date_available' => $date->toDateString(),
                    'maximum_slots' => $request->slot,
                ]);
            }
        }else {
            AppointmentSlot::updateOrInsert([
                'date_available' => $request->date_from
            ], [
                'date_available' => $request->date_from,
                'maximum_slots' => $request->slot,
            ]);
        }
        return response()->json(['message' => 'Appointment slot updated successfully.']);
    }
    public function store(Request $request) {
        DB::beginTransaction();
        try {
            /*
            // Check if user already has an appointment
            $notifAppointmentPending = Notifications::where('notif_type', 'appointment')
                                                    ->where('receiver_id', $request->user_id)
                                                    ->where('content->accept', 'null')
                                                    ->exists();
            if($notifAppointmentPending) {
                return response()->json(['message' => 'You already notify the user. Please wait for their response.'], 400);
            }
            if(Appointment::where('user_id', $request->user_id)->exists()) {
                return response()->json(['message' => 'User already has an appointment.'], 400);
            }*/
            $notification = new NotificationController();
            $timestamp = Carbon::createFromFormat('Y-m-d H:i:s', "{$request->date_appoint} 00:00:00")
                           ->timestamp;
        
            $datetime = Carbon::createFromTimestamp($timestamp)
                            ->toDateTimeString();

            $dateTimeAppoint = Carbon::parse($datetime)
                                    ->setTimeFromTimeString($request->time_start)
                                    ->format('Y-m-d H:i:s');
            $data = [
                'user_id' => $request->user_id,
                'date_time_appoint' => $dateTimeAppoint,
                'reason' => $request->reason
            ];
            $notification->notifySingleUser(
                self::getAppointmentNotifMessage($data),
                [
                    'title' => 'Appointment',
                    'body' => 'You Have Been Scheduled for an Appointment',
                    'url' => '',
                    'icon' => ''
                ]
            );
            $student = User::with('profile')->where('id', $request->user_id)->first();
            $prefect = User::with('profile')->where('id', auth()->user()->id)->first();
            $studentFamilyId = FamilyMember::where('member_id', $request->user_id)->value('family_id');
            $parentMember = $studentFamilyId
                ? FamilyMember::with('member.profile')
                              ->where('family_id', $studentFamilyId)
                              ->whereHas('member', fn($q) => $q->where('role', 'parent'))
                              ->first()
                : null;
            if($parentMember && !is_null($parentMember->member->email)) {
                $data = [
                    'student_name' => $student->profile?->first_name . ' ' . $student->profile?->last_name,
                    'parent_name' => $parentMember->member->profile?->sex == 'male' ? 'Mr. ' . $parentMember->member->profile?->last_name : 'Ms. ' . $parentMember->member->profile?->last_name,
                    'appointment_date' => Carbon::parse($dateTimeAppoint)->format('F j, Y'),
                    'appointment_time' => Carbon::parse($dateTimeAppoint)->format('h:i A'),
                    'prefect_name' => $prefect->profile?->first_name . ' ' . $prefect->profile?->last_name,
                    'contact_number' => $prefect->profile?->contact_number
                ];
                Mail::to($parentMember->member->email)
                    ->send(new AppointmentMail($data));
            }
            ActionLog::create([
                'user_id' =>  auth()->user()->id,
                'action_type' => 'appointment',
                'details' => 'schedules an appointment for the ' . $student->role
            ]);
            DB::commit();
            return response()->json(self::updateAppointment($request)); 
        }catch (Exception $x) {
            DB::rollBack();
            Log::error($x->getMessage());
            return response()->json(['message' => 'Error Processing Appointment', 'error' => $x->getMessage()], 400);
        }
    }
    public function action(Request $request) {
        DB::beginTransaction();
        try {
            $notification = new NotificationController();
            $notif = Notifications::with(['sender', 'receiver'])->where('id', $request->id);
            if (!$notif->exists()) {
                return response()->json(['message' => 'Notification not found.'], 404);
            }

            $notifData = $notif->first();
            $content = json_decode($notifData->content, true);

            // Handle double-encoded JSON (if exists)
            $parsed = isset($content['parse']) && is_string($content['parse'])
                ? json_decode($content['parse'], true)
                : $content;

            // ✅ Update only the specific key
            $parsed['accept'] = $request->action === 'accept';

            // ✅ Encode back properly — preserving structure
            if (isset($content['parse'])) {
                $content['parse'] = json_encode($parsed);
            } else {
                $content = $parsed;
            }

            // Update notif content
            $notif->update(['content' => json_encode($content)]);

            // Decode again for easier access
            $type = $parsed['type'] ?? null;

            // Build notification message
            $data = [
                'sender_id' => $notifData->receiver_id,
                'receiver_id' => $notifData->sender_id,
                'type' => $type,
                'status' => $request->action,
                'date_appoint' => $parsed['date_appoint'],
                'time_appoint' => $parsed['time_appoint'],
            ];

            switch ($request->action) {
                case 'accept':
                    $date = Carbon::parse($parsed['date_appoint'])->format('Y-m-d');
                    $time = Carbon::parse($parsed['time_appoint'])->format('H:i:s');
                    $dateTimeAppoint = "$date $time";

                    if ($type === 'sched') {
                        $lastIndex = Appointment::insertGetId([
                            'user_id' => $notifData->receiver_id,
                            'date_time_appoint' => $dateTimeAppoint,
                            'description' => $parsed['reason']
                        ]);
                        $data['id'] = $lastIndex;
                        $notifMessage = self::notifMessage($data);
                        $notifMessage2 = self::notifMessage($data, false);

                        $notification->notifySingleUser(
                            $notifMessage,
                            [
                                'title' => 'Appointment',
                                'body' => $notifMessage2['content']['receiver_notif_message'],
                                'icon' => '',
                                'url' => ''
                            ]
                        );
                    }if ($type === 'resched') {
                        Appointment::where('id', $request->appointment_id)->update([
                            'date_time_appoint' => $dateTimeAppoint
                        ]);
                        $data['id'] = $request->appointment_id;
                        $notifMessage = self::notifMessage($data);
                        $notifMessage2 = self::notifMessage($data, false);

                        $notification->notifySingleUser(
                            $notifMessage,
                            [
                                'title' => 'Appointment',
                                'body' => $notifMessage2['content']['receiver_notif_message'],
                                'icon' => '',
                                'url' => ''
                            ]
                        );
                    }
                    DB::commit();
                    return response()->json($notifData);
                case 'decline':
                    // Build data for notifMessage()
                    $data['status'] = 'decline';
                    $data['id']     = $request->appointment_id ?? null;
                    $data['reason']     = $request->reason ?? null;

                    // Build notification message (dynamic accept/decline + sched/resched)
                    $notifMessage = self::notifMessage($data);
                    $notifMessage2 = self::notifMessage($data, false);

                    // Send new notification to the Prefect
                    $notification->notifySingleUser(
                        $notifMessage,
                        [
                            'title' => 'Appointment',
                            'body'  => $notifMessage2['content']['receiver_notif_message'],
                            'icon'  => '',
                            'url'   => ''
                        ]
                    );

                    DB::commit();
                    // Return updated notification for frontend re-render
                    return response()->json($notifData);
                default:
                    DB::rollBack();
                    return response()->json(['message' => 'Invalid action.'], 400);
            }
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Notification Action Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'An error occurred while processing your request.',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }
    public function notifMessage($data, $json = true)
    {
        $status = strtolower($data['status']);        // accept / decline
        $type   = strtolower($data['type']);          // sched / resched

        $user = User::with('profile')->where('id', $data['sender_id'])->first();
        $name = "{$user->profile?->first_name} {$user->profile?->last_name}";

        // Dynamic words
        $statusText = $status === 'accept' ? 'accepted' : 'declined';
        $typeText   = $type === 'sched' ? 'appointment' : 'rescheduled appointment';
        $content = [
                // Message Prefect sees
                'sender_notif_message' => "You have {$statusText} the {$typeText}.",

                // Message Student sees
                'receiver_notif_message' => "{$name} has {$statusText} the {$typeText}.",

                'date_appoint' => $data['date_appoint'],
                'time_appoint' => $data['time_appoint'],
                'type'         => $data['type'],
                'status'       => $data['status'],
                'id'           => $data['id'],
                'reason'       => $data['reason'] ?? null,
                'accept'       => $data['status'] === 'accept',
        ];

        return [
            'notif_type'   => 'appointment',
            'sender_id'    => $data['sender_id'],
            'receiver_id'  => $data['receiver_id'],

            'content' => $json ? json_encode($content) : $content,

            'read_since' => null
        ];
    }


    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $notification = new NotificationController();

            // ✅ Safely parse and format date + time
            $userId = Appointment::find($id)->user_id;
            $dateTimeAppoint = Carbon::parse($request->date_appoint)
                ->setTimeFromTimeString($request->time_start)
                ->format('Y-m-d H:i:s');
            
            $data = [
                'user_id' => $userId,
                'date_time_appoint' => $dateTimeAppoint,
                'reason' => $request->reason
            ];

            // ✅ Send reschedule notification
            $notification->notifySingleUser(
                self::getAppointmentNotifMessage($data, 'resched'),
                [
                    'title' => 'Appointment',
                    'body' => 'You have been rescheduled for an appointment.',
                    'url' => '',
                    'icon' => ''
                ]
            );

            // ✅ Get user type
            $type = User::where('id', $request->user_id)->value('role') ?? 'unknown';

            // ✅ Log the action
            ActionLog::create([
                'user_id' => auth()->user()->id,
                'action_type' => 'appointment',
                'details' => "Rescheduled an appointment for the {$type}."
            ]);

            // ✅ Commit all DB changes
            DB::commit();

            return self::get($dateTimeAppoint);

        } catch (\Throwable $e) {
            // Rollback changes if any error occurs
            DB::rollBack();

            // Log error for debugging
            Log::error('Appointment update failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $request->user_id,
            ]);

            return response()->json([
                'message' => 'An error occurred while updating the appointment.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function cancelAppointment(Request $request) {
        $appointment = Appointment::where('id', $request->appointment_id);
        $date = $appointment->first()->date_time_appoint;

        $type = User::select('role')->where('id', $appointment->first()->user_id)->first()->role;
        ActionLog::create([
            'user_id' =>  auth()->user()->id,
            'action_type' => 'appointment',
            'details' => 'cancels an appointment for the ' . $type
        ]);
        $appointment->delete();
        return self::get($date);
    }














    public function getAppointmentAvailableSlots() {
        $slots = AppointmentSlot::select(
                    'id',
                    'date_available',
                    'maximum_slots',
                    DB::raw("
                        maximum_slots - (
                            SELECT COUNT(*)
                            FROM appointment
                            WHERE DATE_FORMAT(appointment.date_time_appoint, '%Y-%m-%d') = DATE_FORMAT(appointment_slot.date_available, '%Y-%m-%d')
                        ) AS slots_remaining
                    ")
                )
                ->where(DB::raw("DATE_FORMAT(date_available, '%Y-%m-%d')"), '>=', DB::raw("DATE_FORMAT(NOW(), '%Y-%m-%d')"))
                ->get();
        
        return response()->json($slots);
    }
    public function getReqList($reqId = null, $json = false) {
        $appointmentReq = new \App\Models\AppointmentRequest();
        $appointmentReq = $appointmentReq->with(['user' => function($q) {
            $q->with(['program', 'parent']);
        }]);

        if($reqId == null) {
            $data = $appointmentReq->where('appointment_id', NULL)
                                  ->latest('created_at')
                                  ->get()
                                  ->toArray();
            return ($json)
                    ? response()->json($data)
                    : $data;
        }else {
            $data = $appointmentReq->where('id', $reqId)->first();
            return ($json)
                    ? response()->json($data)
                    : $data;
        }
    }
    public function getUpcomingAppointmentList($id) {
        return User::with(['appointment' => function($q) {
                       $q->whereRaw('date_time_appoint BETWEEN NOW() AND date_time_appoint')
                         ->latest('created_at');
                   }])
                   ->where('id', $id)
                   ->get();
    }
    public function getAppointment(Request $request)
    {
        $mY = $request->month_year
            ? $request->month_year
            : now()->format('Y-m');

        $data = Appointment::select(
                DB::raw("DATE(date_time_appoint) AS appoint_date"),
                DB::raw("COUNT(DISTINCT user_id) AS user_count")
            )
            ->where(DB::raw("DATE_FORMAT(date_time_appoint, '%Y-%m')"), $mY)
            ->groupBy(DB::raw("DATE(date_time_appoint)"))
            ->orderBy(DB::raw("DATE(date_time_appoint)"))
            ->get();

        return $data;
    }

    public function get($date, $type = 'accepted')
    {
        // Format incoming date
        $formattedDate = date('Y-m-d', strtotime($date));

        /* ----------------------------------------
        * 1) PENDING — from notifications table
        * -------------------------------------- */
        if ($type === 'pending') {

            $data = Notifications::with([
                        'receiver' => function ($q) {
                            $q->with(['profile', 'program', 'parent']);
                        }
                    ])
                    ->where('notif_type', 'appointment')
                    ->get()
                    ->filter(function ($item) use ($formattedDate) {

                        // --- Safe JSON decode ---
                        $content = $item->content;

                        if (is_string($content)) {
                            $content = json_decode($content, true);
                        }

                        if (!is_array($content)) {
                            return false;
                        }

                        // --- Must have 'accept' and it must be pending (null) ---
                        if (!array_key_exists('accept', $content) || $content['accept'] !== null) {
                            return false;
                        }

                        // --- Parse 'date_appoint' from content ---
                        // Convert "November 15, 2025" → "2025-11-15"
                        $contentDate = \Carbon\Carbon::parse($content['date_appoint'])->format('Y-m-d');

                        // Compare to requested date
                        return $contentDate === $formattedDate;
                    })
                    ->values();



            return response()->json($data);

        }

        /* ----------------------------------------
        * 2) ACCEPTED — from appointment table
        * -------------------------------------- */
        if ($type === 'accepted') {

            $data = Appointment::with([
                'user' => function ($q) {
                    $q->with(['profile', 'program', 'parent']);
                }
            ])
                ->whereDate('date_time_appoint', $formattedDate)
                ->orderBy('date_time_appoint', 'asc')
                ->get();

            return response()->json($data);
        }

        /* ----------------------------------------
        * DEFAULT — if type is not recognized
        * -------------------------------------- */
        return response()->json([]);
    }

    public function getAppointmentToday() {
        return Appointment::with(['user' => function($q) {
                                $q->with(['profile', 'program', 'parent']);
                            }])
                          ->where(DB::raw("DATE_FORMAT(date_time_appoint, '%Y-%m-%d')"), DB::raw("DATE_FORMAT(NOW(), '%Y-%m-%d')"))
                          ->get();
    }
    public function updateAppointment($request) {
        return [
            'appointment_list' => self::getAppointment($request),
            'scheduled_users' => self::get($request->date_appoint),
        ];
    }
    public function checkAppointmentSlot($dateTime) {
        $timestamp = Carbon::createFromFormat('Y-m-d H:i:s', "{$dateTime}")
                           ->timestamp;
        $datetime = Carbon::createFromTimestamp($timestamp)
                          ->toDateTimeString();
        $dateAppointmentSlot = AppointmentSlot::where('date_available', $datetime)
                                          ->first();

        $appointmentSlot = AppointmentSlot::where('maximum_slots', '>', 5)
                                          ->where('date_available', $datetime)
                                          ->first();
        return $appointmentSlot;
    }
    public function getAppointmentNotifMessage($data, $type = 'sched') {
        /*
        $dateTime = Appointment::where('id', $appointmentId)->first();
        $date = Carbon::parse($dateTime->date_time_appoint)->format('F j, Y');
        $time = Carbon::parse($dateTime->date_time_appoint)->format('h:i A');
        $reason = $dateTime->description;
        */
        $dateTime = Carbon::make($data['date_time_appoint']) ?? now();

        $date = $dateTime->format('F j, Y');
        $time = $dateTime->format('h:i A');
        $reason = $data['reason'] ?? 'No reason specified';
        $t = $type === 'sched' ? 'Scheduled' : 'Rescheduled';

        return [
            'notif_type' => 'appointment',
            'sender_id' => auth()->user()->id,
            'receiver_id' => $data['user_id'],
            'content' => json_encode([
                'sender_notif_message' => 'This user has been scheduled for an appointment.',
                'receiver_notif_message' => "You have been $t for your appointment.",
                'type' => $type,
                'date_appoint' => $date,
                'time_appoint' => $time,
                'reason' => $reason,
                'accept' => null,
            ]),
            'read_since' => null,
        ];
    }
}
