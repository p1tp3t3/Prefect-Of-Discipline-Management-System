<?php

namespace App\Http\Controllers\Modules\Family;

use App\Http\Controllers\Controller;
use App\Models\Family;
use App\Models\FamilyMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FamilyController extends Controller
{
    public function index() {
        // Parents not yet assigned
        $parentList = User::whereNotIn('id', FamilyMember::pluck('member_id'))
            ->with(['profile', 'parent'])
            ->where('role', 'parent')
            ->get();

        // Students not yet assigned
        $studentList = User::whereNotIn('id', FamilyMember::pluck('member_id'))
            ->with(['profile', 'program'])
            ->where('role', 'student')
            ->get();

        return Inertia::render('prefect/families', [
            'user' => auth()->user(),
            'family_list' => self::getFamily(),
            'parents' => $parentList,
            'students' => $studentList,
        ]);
    }
    public function action(Request $request) {
        switch($request->type) {
            case 'join':
                return self::joinMember($request);
            case 'move':
                return self::moveMember($request);
            case 'swap':
                return self::swapMembers($request);
        }
    }
    private function joinMember($request)
    {
        $request->validate([
            'family_id' => 'required|exists:family,id',
            'user_id'   => 'required|exists:users,id'
        ]);

        DB::beginTransaction();

        try {

            $familyId = $request->family_id;
            $user     = User::where('id', $request->user_id)->first();

            if (FamilyMember::where('member_id', $user->id)->exists())
            {
                DB::rollBack();
                return response()->json(['message' => 'User already belongs to a family'], 400);
            }

            FamilyMember::create([
                'family_id' => $familyId,
                'member_id' => $user->id,
            ]);

            DB::commit();
            return response()->json(['message' => 'User successfully joined family'], 200);

        } catch (\Exception $e) {

            DB::rollBack();
            return response()->json([
                'message' => 'Failed to join member',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    private function moveMember($request)
    {
        $request->validate([
            'user_id'       => 'required|exists:users,id',
            'to_family_id'  => 'required|exists:family,id',
        ]);

        DB::beginTransaction();

        try {

            $user = User::where('id', $request->user_id)
                ->with('parent') // load parent role if parent
                ->first();

            /* -----------------------------------------------------------
            | FIND CURRENT FAMILY
            |------------------------------------------------------------ */
            $fromFamily = FamilyMember::where('member_id', $user->id)->value('family_id');

            if (!$fromFamily) {
                DB::rollBack();
                return response()->json(['message' => 'User is not part of any family'], 404);
            }

            if ($fromFamily == $request->to_family_id) {
                DB::rollBack();
                return response()->json(['message' => 'User is already in the selected family'], 422);
            }

            /* -----------------------------------------------------------
            | LOAD TARGET FAMILY MEMBERS
            |------------------------------------------------------------ */
            $targetMemberIds = FamilyMember::where('family_id', $request->to_family_id)
                ->pluck('member_id')
                ->unique()
                ->toArray();

            $targetParentRoles = User::whereIn('id', $targetMemberIds)
                ->where('role', 'parent')
                ->with('parent')
                ->get()
                ->pluck('parent.parent_role')
                ->filter()
                ->map(fn($r) => strtolower($r))
                ->toArray();

            /* -----------------------------------------------------------
            | VALIDATION RULES
            |------------------------------------------------------------ */

            // ❌ Cannot move student → same family where student already exists
            if ($user->role === 'student' && in_array($user->id, $targetMemberIds)) {
                DB::rollBack();
                return response()->json([
                    'message' => 'This student already exists in the target family'
                ], 422);
            }

            // ❌ Cannot move parent → family with same parent role
            if ($user->role === 'parent') {

                $movingRole = strtolower($user->parent->parent_role);

                if (in_array($movingRole, $targetParentRoles)) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "This family already has a {$movingRole}"
                    ], 422);
                }
            }

            /* -----------------------------------------------------------
            | MOVE INTO TARGET FAMILY
            |------------------------------------------------------------ */
            FamilyMember::where('member_id', $user->id)
                ->update(['family_id' => $request->to_family_id]);

            DB::commit();
            return response()->json(['message' => 'Member moved successfully'], 200);

        } catch (\Exception $e) {

            DB::rollBack();
            return response()->json([
                'message' => 'Failed to move member',
                'error'   => $e->getMessage()
            ], 500);
        }
    }


    private function swapMembers($request)
    {
        $request->validate([
            'memberA' => 'required|exists:users,id',
            'memberB' => 'required|exists:users,id'
        ]);

        DB::beginTransaction();

        try {

            $userA = User::where('id', $request->memberA)->with('parent')->first();
            $userB = User::where('id', $request->memberB)->with('parent')->first();

            /* -----------------------------------------------------------
            | VALIDATION RULES
            |------------------------------------------------------------ */
            $isAParent  = $userA->role === 'parent';
            $isBParent  = $userB->role === 'parent';
            $isAStudent = $userA->role === 'student';
            $isBStudent = $userB->role === 'student';

            // ❌ Parent ↔ Student
            if (($isAParent && $isBStudent) || ($isAStudent && $isBParent)) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Parent cannot be swapped with student'
                ], 422);
            }

            // ✔ Student ↔ Student → allowed

            // ❌ Parent ↔ Parent but same roles
            if ($isAParent && $isBParent) {

                $roleA = strtolower($userA->parent->parent_role);
                $roleB = strtolower($userB->parent->parent_role);

                if ($roleA === $roleB) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "Cannot swap two parents with the same role ($roleA ↔ $roleB)"
                    ], 422);
                }
            }

            /* -----------------------------------------------------------
            | FIND FAMILY A AND FAMILY B
            |------------------------------------------------------------ */
            $familyA = FamilyMember::where('member_id', $userA->id)->value('family_id');
            $familyB = FamilyMember::where('member_id', $userB->id)->value('family_id');

            if (!$familyA || !$familyB) {
                DB::rollBack();
                return response()->json([
                    'message' => 'One or both users do not belong to a family'
                ], 400);
            }

            /* -----------------------------------------------------------
            | SWAP THEIR FAMILIES
            |------------------------------------------------------------ */
            FamilyMember::where('member_id', $userA->id)->update(['family_id' => $familyB]);
            FamilyMember::where('member_id', $userB->id)->update(['family_id' => $familyA]);

            DB::commit();

            return response()->json([
                'message' => 'Members swapped successfully'
            ], 200);

        } catch (\Exception $e) {

            DB::rollBack();
            return response()->json([
                'message' => 'Swap failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getFamilyMember($id)
    {
        $familyId = $id;

        if (!$familyId) {
            return response()->json([], 400);
        }

        $family = Family::with(['familyMember.member.profile', 'familyMember.member.program'])
            ->where('family_code', $familyId)
            ->first();

        if (!$family) {
            return response()->json([], 404);
        }

        $members = [];

        foreach ($family->familyMember as $familyMember) {
            if (!$familyMember->member) continue;

            $members[] = [
                'user_id' => $familyMember->member->id,
                'user' => $familyMember->member,
            ];
        }

        return response()->json(collect($members)->unique('user_id')->values()->all());
    }

    public function getFamily() {
        // Check if a search value is passed in the query string
        $search = $_GET['search'] ?? null;

        $families = Family::with(['familyMember.member.profile'])
            ->when($search, function ($query, $search) {
                $query->where('id', 'like', "%{$search}%");
            })
            ->latest('created_at')
            ->get();

        $familyMember = [];

        foreach ($families as $family) {
            $members = [];

            foreach ($family->familyMember as $fm) {
                if (!$fm->member) continue;

                $members[] = [
                    'user_id' => $fm->member->id,
                    'user' => $fm->member,
                ];
            }

            $familyMember[] = [
                'id' => $family->id,
                'family_code' => $family->family_code,
                'family' => $family->family_name,
                'created_at' => $family->created_at,
                'members' => collect($members)->unique('user_id')->values()->all()
            ];
        }

        return $familyMember;
    }
}
