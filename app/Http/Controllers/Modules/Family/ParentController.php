<?php

namespace App\Http\Controllers\Modules\Family;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Modules\Account\RegisteredUserController;
use App\Mail\ParentAccountMail;
use App\Mail\ParentRejectMail;
use App\Models\Family;
use App\Models\FamilyMember;
use App\Models\ParentRegistrationRequest;
use App\Models\User;
use FFI\Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ParentController extends Controller
{
    public function index() {
        $parentRequests = ParentRegistrationRequest::latest('created_at')->get();

        return Inertia::render('itrc/parent-approval-request', [
            'user' => auth()->user(),
            'parent_requests' => $parentRequests
        ]);
    }
    public function store(Request $request) {
        try {
            $key = $request->email . '_otp_hash';
            if(!Hash::check($request->pin, cache($key))) {
                return response()->json(['message' => 'error'], 500);
            }
            ParentRegistrationRequest::insert([
                'name' => $request->name,
                'email' => $request->email,
                'reason' => $request->reason,
                'parent_details' => json_encode($request->parent_details),
            ]);
            cache()->forget($key);
            return response()->json(['message' => 'success']);
        }catch(Exception $x) {
            return response()->json(['message' => 'error'], 500);
        }
    }

    public function storeFamily(Request $request) {
        DB::beginTransaction();
        try {
            //generate parent account
            $parent = self::generateParentAccount($request);
            //create family with family members
            $family = Family::insertGetId([
                'family_name' => $request->family_group_name
            ]);
            FamilyMember::insert([
                'family_id' => $family,
                'member_id' => $parent['id'],
            ]);
            foreach($request->children as $c) {
                FamilyMember::insert([
                    'family_id' => $family,
                    'member_id' => $c,
                ]);
            }
            //email the account to the parent
            Mail::to($request->email)
                ->send(new ParentAccountMail([[
                    'name' => $parent['name'],
                    'user_id' => $parent['id'],
                    'username' => $parent['username'],
                    'password' => $parent['password']
                ]]));
            DB::commit();
        }catch(Exception $x) {
            DB::rollBack();
        }
    }

    public function joinFamily(Request $request) {
        DB::beginTransaction();
        try {
            $parent = self::generateParentAccount($request);
            $familyId = $request->family_id;
            $user = User::where('user_id', $parent['id'])->first();

            if (FamilyMember::where('member_id', $user->user_id)->exists())
            {
                DB::rollBack();
                return response()->json(['message' => 'User already belongs to a family'], 400);
            }

            if ($user->user_type === 'parent') {
                FamilyMember::create([
                    'family_id' => $familyId,
                    'member_id' => $user->user_id,
                ]);
            }
            Mail::to($request->email)
                ->send(new ParentAccountMail([[
                    'name' => $parent['name'],
                    'user_id' => $parent['id'],
                    'username' => $parent['username'],
                    'password' => $parent['password']
                ]]));
            DB::commit();
        }catch(Exception $x) {
            DB::rollBack();
        }
    }

    private function generateParentAccount($request) {
        $register = new RegisteredUserController();
        $parentId = $register->generateParentId();
        $details = $request->parent_details;
        $username = generate_username($details->first_name);
        $password = random_int(100000000, 999999999);
        

        $data = [
            'first_name' => $details->first_name,
            'middle_name' => $details->middle_name,
            'last_name' => $details->last_name,
            'date_of_birth' => $details->birth_date,
            'sex' => $details->sex,
            'user_id' => $parentId,
            'user_type' => 'parent',
            'username' => $username,
            'password' => $password,
            'activate' => 1,
            'parent_role' => $details->parent_role,
            'work_occupation' => $details->work_occupation
        ];
        $name = $data['first_name'] . ' ' . $data['middle_name'] . ' ' . $data['last_name'];

        $data = (object)$data;
        $register->createUser($data);

        return [
            'id' => $parentId,
            'name' => $name,
            'username' => $username,
            'password' => $password
        ];
    }

    public function destroy(Request $request) {
        $reason = $request->reason;
        $parent = ParentRegistrationRequest::find($request->id);
        $parentEmail = $parent->value('email');

        Mail::to($parentEmail)
            ->send(new ParentRejectMail($reason));
        $parent->delete();
        return response()->json([
            'message' => 'Parent Request Reject Successfully'
        ]);
    }

    public function getParentRequest($id) {
        return ParentRegistrationRequest::find($id);
    }
}
