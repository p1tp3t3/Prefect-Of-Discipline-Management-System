<?php

namespace App\Http\Controllers\Modules\GatePass;

use App\Events\SendGatePass;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Modules\Account\AccountController;
use App\Http\Controllers\NotificationController;
use App\Mail\GatePassMail;
use App\Models\ActionLog;
use App\Models\GatePass;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use PHPQRCode\QRcode;

class GatePassController extends Controller
{
    public function index() {
        $isPrefect = self::isPrefect() ? 'prefect' : 'other';
        $account = new AccountController();

        $guard = User::where('role', 'guard')
                     ->where('id', auth()->user()->id);

        $gatepass = '';
        if(isset($_GET['status'])) {
            if($_GET['status'] == 'confirmed-users') {
                $gatepass = self::getAllApprovedGatePass();
            }else if($_GET['status'] == 'expired-users') {
                $gatepass = self::getGatePassExpired();
            }else {
                $gatepass = self::getAllGatePassRequest();
            }
        }else {
            $gatepass = self::getAllGatePassRequest();
        }

        return Inertia::render("$isPrefect/gatepass", [
            'user' => ($guard->exists()) ? $guard->first() : auth()->user(),
            'program_name' => $account->isProgramHead(),
            'gatepass_request_list' => $gatepass,
            'user_gatepass' => self::getGatePass(auth()->user()->id)
        ]);
    }
    public function qrcodeIndex() {
        $account = new AccountController();

        return Inertia::render('staff/gatepass-verification', [
            'user' => auth()->user(),
            'program_name' => null,
            'gatepass_approved_list' => self::getAllGatePass()->get()
        ]);
    }
    public function prefectIndex() {
        return Inertia::render('prefect/gatepass', [
            'user' => auth()->user(),
        ]);
    }
    public function gatePassApproveUserIndex() {
        return Inertia::render('staff/gatepass-approval', [
            'user' => auth()->user(),

            'gatepass_approved_list' => self::getAllGatePass()->get()
        ]);
    }
    public function gatepassRequest(Request $request) {
        $notification =  new NotificationController();
        $senderName =  auth()->user()->profile?->first_name . ' ' .  auth()->user()->profile?->last_name;
        $prefectId = User::where('role', 'sub_admin')->first()?->id;
        $webpushNotif = [
            'title' => 'Gate Pass Request',
            'body' => "$senderName Has Requested a Gate Pass.",
            'icon' =>'',
            'url' => url('/prefect/gatepass'),
        ];
        $now = Carbon::now();

        if(auth()->user()->permissions?->allow_gatepass != 1)
            return response()->json(['message' => 'you are restricted of requesting a gatepass'], 400);

        if ($now->hour >= 15 || $now->hour < 7)
            return response()->json([
                'message' => 'You cannot request a gatepass between 3pm to 7am.'
            ], 400);


        DB::beginTransaction();
        try {

            $lastIndex = GatePass::insertGetId([
                'user_id' => auth()->user()->id,
                'reason' =>  $request->other_reason
            ]);
            $notification->notifySingleUser(
                self::getGatePassRequestNotif($lastIndex, $prefectId),
                $webpushNotif,
                new SendGatePass($prefectId)
            );
            ActionLog::create([
                'user_id' =>  auth()->user()->id,
                'action_type' => 'gatepass',
                'details' => 'requests a gatepass to the prefect'
            ]);
            DB::commit();
            return response()->json(['message' => 'success']);
        }catch(Exception $x) {
            DB::rollBack();
            return response()->json(['message' => $x->getMessage()], 400);
        }
    }
    public function approveGatePassRequest($id) {
        $gatepass = GatePass::with(['user.profile', 'user.program'])->where('id', $id);
        $expDate = request('expiration_date');
        $notification =  new NotificationController();


        DB::beginTransaction();
        try {
            $gatepass->update([
                'confirmed_at' => now(),
                'allow_to' => json_encode(request('allow_to')),
                'date_expiration' => $expDate
            ]);
            $prefect = auth()->user()->profile?->first_name . " " . auth()->user()->profile?->last_name;
            $gatepass = $gatepass->first();

            $data = [
                'requester' => $gatepass->user->profile?->first_name,
                'status' => 'approve',
                'date_requested' => $gatepass->created_at,
                'date_time_expiration' => $gatepass->date_expiration,
                'prefect_name' => $prefect
            ];
            $dataNotif = [
                'id'                  => $gatepass->id,
                'first_name'          => $gatepass->user->profile?->first_name,
                'last_name'           => $gatepass->user->profile?->last_name,
                'profile_picture'     => $gatepass->user->profile?->profile_picture,
                'user_type'           => $gatepass->user->role,
                'name'                => $gatepass->user->program?->name,
                'reason'              => $gatepass->reason,
                'allow_to'            => json_encode(request('allow_to')),
                'confirmed_at'        => $gatepass->confirmed_at,
                'date_expiration'     => $gatepass->date_expiration,
                'created_at'          => $gatepass->created_at,
            ];

            $webpushNotif = [
                'title' => 'Gate Pass Request',
                'body' => "Your Gate Pass Has Been Approved.",
                'icon' =>'',
                'url' => url('/prefect/gatepass'),
            ];
            $gatepass = $gatepass->first();

            $notification->notifySingleUser(
                self::getGatePassResponseNotif($gatepass->user_id, $dataNotif),
                $webpushNotif,
                new SendGatePass($gatepass->user_id)
            );
            ActionLog::create([
                'user_id' =>  auth()->user()->id,
                'action_type' => 'gatepass',
                'details' => 'approves the gatepass request of ' . $gatepass->user->profile?->first_name
            ]);
            Mail::to($gatepass->user->email)
                ->send(new GatePassMail($data));
            DB::commit();
            return response()->json(self::getAllGatePassRequest()->toArray());

        }catch(Exception $x) {
            DB::rollBack();
            return response()->json(['message' => $x->getMessage()], 400);
        }

    }
    public function disapproveGatePassRequest($id) {
        DB::beginTransaction();
        try {
            $gatepass = GatePass::with('user.profile')->where('id', $id);
            ActionLog::create([
                'user_id' =>  auth()->user()->id,
                'action_type' => 'gatepass',
                'details' => 'rejects the gatepass request of ' . $gatepass->first()->user->profile?->first_name
            ]);
            $gatepass->delete();
            DB::commit();
            return response()->json(self::getAllGatePassRequest()->toArray());
        }catch (Exception $x) {
            DB::rollBack();
            return response()->json(['message' => $x], 400);
        }
    }


    public function get($id) {
        $data = GatePass::with(['user' => function($q)  {
                        $q->with(['profile', 'program']);
                        }])
                        ->where('id', $id)
                        ->get();

        return response()->json($data);
    }


    public function getAllApprovedGatePass() {
        return self::getAllGatePass()->get();
    }
    public function getGatePass($id) {
        return User::with(['gatepass' => function($query) {
            $query->latest('created_at');
                    }])
                   ->where('id', $id)
                   ->first();
    }
    private function isPrefect() {
        return auth()->user()->role == 'sub_admin';
    }
    public function getAllGatePassRequest() {
        return GatePass::with(['user.profile', 'user.program'])
                       ->where('confirmed_at', NULL)
                       ->latest('created_at')
                       ->get();
    }
    public function getAllGatePass() {

    return User::with(['profile'])
        ->whereHas('gatepass', function ($q) {
            $q->whereNotNull('confirmed_at')
            ->where('date_expiration', '>=', now());
        })
        ->with(['gatepass' => function ($q) {
            $q->whereNotNull('confirmed_at')
            ->where('date_expiration', '>=', now())
            ->latest()
            ->limit(1);
        }])
        ->orderByDesc(
            GatePass::select('confirmed_at')
                ->whereColumn('gate_pass.user_id', 'users.id')
                ->whereNotNull('confirmed_at')
                ->where('date_expiration', '>=', now())
                ->latest()
                ->limit(1)
        );
    }
    public function getGatePassExpired() {
        return User::with(['profile'])
        ->whereHas('gatepass', function ($q) {
            $q->whereNotNull('confirmed_at')
            ->where('date_expiration', '<=', now());
        })
        ->with(['gatepass' => function ($q) {
            $q->whereNotNull('confirmed_at')
            ->where('date_expiration', '<=', now())
            ->latest()
            ->limit(1);
        }])
        ->orderByDesc(
            GatePass::select('confirmed_at')
                ->whereColumn('gate_pass.user_id', 'users.id')
                ->whereNotNull('confirmed_at')
                ->where('date_expiration', '<=', now())
                ->latest()
                ->limit(1)
        );
    }
    public function getGatePassRequestNotif($id, $receiver) {
        $user = auth()->user();

        // Build consistent notification payload for getContent()
        $data = [
            'sender_message'     => 'You have requested a gate pass.',
            'receiver_message'   => $user->profile?->first_name . ' ' . $user->profile?->last_name . ' has requested a gate pass.',
            'id'        => $id,
            // User info
            'first_name'         => $user->profile?->first_name,
            'last_name'          => $user->profile?->last_name,
            'profile_picture'    => $user->profile?->profile_picture,
            'user_type'          => $user->role,
            'name'               => $user->program?->name ?? null,

            // Gatepass info (only reason is known at request stage)
            'reason'             => request('other_reason') ?? null,
            'allow_to'           => null,
            'confirmed_at'       => null,
            'date_expiration'    => null,
            'created_at'         => now(),
        ];

        return [
            'notif_type'  => 'gatepass',
            'sender_id'   => $user->id,
            'receiver_id' => $receiver,
            'content'     => $this->getContent($data),  // ⬅️ FIXED
            'read_since'  => null
        ];

    }
    public function getGatePassResponseNotif($receiver, $data) {
        $dataNotif = [
            'sender_message'      => "Your gatepass request has been approved.",
            'receiver_message'    => "Your gatepass request has been approved.",
            'id'                  => $data['id'],
            'first_name'          => $data['first_name'],
            'last_name'           => $data['last_name'],
            'profile_picture'     => $data['profile_picture'],
            'user_type'           => $data['user_type'],
            'name'                => $data['name'],
            'reason'              => $data['reason'],
            'allow_to'            => request('allow_to'),
            'confirmed_at'        => $data['confirmed_at'],
            'date_expiration'     => $data['date_expiration'],
            'created_at'          => $data['created_at'],
        ];
        return [
            'notif_type' => 'gatepass',
            'sender_id'  => auth()->user()->id,
            'receiver_id'=> $receiver,
            'content'    => $this->getContent($dataNotif),
            'read_since' => NULL
        ];
    }

    public function getContent($data) {
        return json_encode([
            'sender_notif_message'   => $data['sender_message'],
            'receiver_notif_message' => $data['receiver_message'],
            'gatepass' => [
                'id' => $data['id'] ?? null,
                'user' => [
                    'first_name'      => $data['first_name'] ?? null,
                    'last_name'       => $data['last_name'] ?? null,
                    'profile_picture' => $data['profile_picture'] ?? null,
                    'user_type'       => $data['user_type'] ?? null,
                    'student' => [
                        'program' => [
                            'name' => $data['name'] ?? null
                        ]
                    ]
                ],
                'reason'         => $data['reason'] ?? null,
                'allow_to'       => $data['allow_to'] ?? null,
                'confirmed_at'   => $data['confirmed_at'] ?? null,
                'date_expiration'=> $data['date_expiration'] ?? null,
                'created_at'     => $data['created_at'] ?? now(),
            ]
        ]);
    }

}
