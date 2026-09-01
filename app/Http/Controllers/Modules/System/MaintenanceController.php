<?php

namespace App\Http\Controllers\Modules\System;

use App\Events\MaintenanceModeToggled;
use App\Exports\UserAccountExport;
use App\Http\Controllers\Controller;
use App\Models\ComplaintSubject;
use App\Models\ComplaintSubjectViolation;
use App\Models\Enrollment;
use App\Models\Penalty;
use App\Models\Program;
use App\Models\TeachingStaff;
use App\Models\Violation;
use App\Models\ViolationPenalty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Excel as ExcelFormat;


class MaintenanceController extends Controller
{
    public function index() {
        return Inertia::render('itrc/system-maintenance', [
            'user' => auth()->user(),
            'maintenance_mode' => Cache::get('maintenance_mode', false)
        ]);
    }

    /**
     * Lightweight, unauthenticated-looking preview of what a regular visitor
     * currently sees, meant to be embedded in an iframe on the Maintenance
     * Mode tab. Renders purely off the cache flag — never exempted by role,
     * so it reflects the real state even when viewed by a super admin whose
     * own session bypasses the maintenance block.
     */
    public function preview() {
        return view('maintenance-preview', [
            'enabled' => Cache::get('maintenance_mode', false),
        ]);
    }

    /**
     * Violation type / penalty management — shared by super_admin and sub_admin,
     * moved out of the super_admin-only Maintenance page.
     */
    public function violationManagementIndex() {
        $violations = Violation::query()
                        ->with(['penalties' => function ($q) {
                            $q->join('penalty', 'penalty.id', '=', 'violation_penalty.penalty_id')
                            ->select(
                                'violation_penalty.*',
                                'penalty.description as penalty_description'
                            );
                        }])
                        ->latest('created_at')
                        ->get();

        return Inertia::render('other/violation-management', [
            'user' => auth()->user(),
            'violation' => $violations,
            'penalty' => Penalty::latest('created_at')->get()
        ]);
    }

    public function toggleMaintenanceMode(Request $request) {
        $enabled = $request->boolean('enabled');

        Cache::forever('maintenance_mode', $enabled);

        broadcast(new MaintenanceModeToggled($enabled));

        return response()->json(['maintenance_mode' => $enabled]);
    }
    public function programIndex() {
        return Inertia::render('itrc/program', [
            'user' => auth()->user(),
            'program' => Program::latest('created_at')->get()
        ]);
    }
    public function programStore(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'color' => 'required'
        ]);
        $data = [
            'name' => Str::upper($request->name),
            'description' => ucwords($request->description),
            'color_code' => $request->color
        ];

        $program = Program::create($data);

        $programId = $program->id;
        $programName = $program->name;

        /* =============================
        FACULTY CSV EXPORT (EMPTY)
        ============================= */
        $facultyHeader = ['id','name','program','username','password'];
        $facultyFile = "zips/faculty-account-{$programId}-{$programName}.csv";

        Excel::store(
            new UserAccountExport([$facultyHeader]),
            $facultyFile,
            'public',
            ExcelFormat::CSV
        );


        /* =============================
        STUDENT 4 CSVs -> ZIP EXPORT
        ============================= */
        // Slug program name for safe filename

        $programSlug = strtoupper(Str::slug($programName ?: 'unknown', '-'));

        // directory for zips
        $zipsDir = storage_path('app/private/zips');
        if (!File::exists($zipsDir)) {
            File::makeDirectory($zipsDir, 0775, true, true);
        }

        $zipPath = "{$zipsDir}/student-{$programId}-{$programSlug}.zip";
        if (File::exists($zipPath)) {
            File::delete($zipPath);
        }

        $zip = new \ZipArchive();
        $openStatus = $zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);

        if ($openStatus !== true) {
            Log::error("ZIP FAILED", ['zipPath' => $zipPath, 'openStatus' => $openStatus]);
            throw new \Exception("Cannot create ZIP file: {$zipPath}");
        }

        // CSV headers
        $studentHeader = ['id','name','program','year_level','username','password'];

        // Write 4 CSV files directly into ZIP
        foreach ([1,2,3,4] as $yearLevel) {
            $csvName = "student-account-{$programId}-{$programSlug}-year-{$yearLevel}.csv";
            $csvContent = implode(",", $studentHeader) . "\n";
            $zip->addFromString($csvName, $csvContent);
        }

        $zip->close();

        Log::info("ZIP CREATED SUCCESSFULLY", ['zipPath' => $zipPath]);

        return Program::latest('created_at')->get();
    }
    public function updateProgram(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'color' => 'required'
        ]);

        $program = Program::where('id', $request->id)->first();

        $oldSlug = strtoupper(Str::slug($program->name));
        $newSlug = strtoupper(Str::slug($data['name'], '-'));

        // Old file paths
        $oldFaculty = storage_path("app/private/zips/faculty-account-{$program->id}-{$oldSlug}.csv");
        $oldStudent = storage_path("app/private/zips/student-{$program->id}-{$oldSlug}.zip");

        // New file paths
        $newFaculty = storage_path("app/private/zips/faculty-account-{$program->id}-{$newSlug}.csv");
        $newStudent = storage_path("app/private/zips/student-{$program->id}-{$newSlug}.zip");

        $program = Program::where('id', $request->id);
        // Update database
        $program->update([
            'name' => $data['name'],
            'description' => $data['description'],
            'color_code' => $data['color']
        ]);

        // Rename files if exists
        if (file_exists($oldFaculty)) {
            rename($oldFaculty, $newFaculty);
        }

        if (file_exists($oldStudent)) {
            rename($oldStudent, $newStudent);
        }

        return Program::latest('created_at')->get();
    }

    public function destroyProgram(Request $request)
    {

        $program = Program::where('id', $request->id)->first();
        $programSlug = strtoupper($program->name);

        // Check related records
        $studentCount = Enrollment::where('program_id', $program->id)->where('status', 'enrolled')->count();
        $facultyCount = TeachingStaff::where('program_id', $program->id)->count();

        if ($studentCount > 0 || $facultyCount > 0) {
            return response()->json([
                'status' => false,
                'message' => 'Program cannot be deleted. Users are still assigned to this program.'
            ], 409);
        }

        // File paths
        $facultyFile = storage_path("app/private/zips/faculty-account-{$program->id}-{$programSlug}.csv");
        $studentZip  = storage_path("app/private/zips/student-{$program->id}-{$programSlug}.zip");

        // Delete program
        $program->delete();

        // Delete files if exist
        if (file_exists($facultyFile)) unlink($facultyFile);
        if (file_exists($studentZip)) unlink($studentZip);

        return Program::latest('created_at')->get();
    }



    public function offenseStore(Request $request) {
        // Validate violation
        $data = $request->validate([
            'violation_name' => 'required|string|max:191',
            'offense_status' => 'required|in:1,0',
            'penalties' => 'required|array',
        ]);
        

        // Create violation
        $violation = Violation::create([
            'violation_name' => $data['violation_name'],
            'offense_status' => $data['offense_status'],
        ]);

        // =============================
        // STORE VIOLATION PENALTIES
        // =============================
        foreach ($request->penalties as $penaltyOcc) {

            $occurrence = $penaltyOcc['occurrence'];

            foreach ($penaltyOcc['list'] as $p) {

                // Skip empty penalty selections
                if (empty($p['penalty_id'])) {
                    continue;
                }

                ViolationPenalty::insert([
                    'violation_id' => $violation->id,
                    'occurrence'   => $occurrence,
                    'penalty_id'   => $p['penalty_id']
                ]);
            }
        }

        Http::withoutVerifying()->post('https://pitpete-violation-risk-predictor-api.hf.space/python/violation/add', [
            'violation' => preg_replace('/[^\w\s]/', ' ', $data['violation_name']),
            'id' => $violation->id
        ]);

        return self::getViolation();
    }
    public function updateOffense(Request $request)
    {
        // VALIDATION
        $data = $request->validate([
            'violation_name' => 'required|string|max:191',
            'offense_status' => 'required|in:1,0',
            'penalties'      => 'required|array',
        ]);

        // UPDATE VIOLATION RECORD
        Violation::where('id', $request->id)->update([
            'violation_name' => $data['violation_name'],
            'offense_status' => $data['offense_status'],
        ]);

        // =============================
        // UPDATE VIOLATION PENALTIES
        // =============================

        // 1. Delete all existing penalties for this violation
        ViolationPenalty::where('violation_id', $request->id)->delete();

        // 2. Insert updated penalties
        foreach ($request->penalties as $penaltyOcc) {

            $occurrence = $penaltyOcc['occurrence'];

            foreach ($penaltyOcc['list'] as $p) {

                // Skip empty penalty selections
                if (empty($p['penalty_id'])) {
                    continue;
                }

                ViolationPenalty::insert([
                    'violation_id' => $request->id,
                    'occurrence'   => $occurrence,
                    'penalty_id'   => $p['penalty_id'],
                ]);
            }
        }

        // RETURN updated list with penalties included
        return self::getViolation();
    }

    public function destroyOffense(Request $request) {
        $violation = Violation::where('id', $request->id)->first();

        // Check related records
        $complaintCount = ComplaintSubjectViolation::where('violation_id', $request->id)->count();

        if ($complaintCount > 0) {
            return response()->json([
                'status' => false,
                'message' => 'Violation cannot be deleted. It is still assigned to complaint subjects.'
            ], 409);
        }

        Http::withoutVerifying()->post('https://pitpete-violation-risk-predictor-api.hf.space/python/violation/delete', [
            'id' => $violation->id
        ]);
        // Delete violation
        $violation->delete();


        return self::getViolation();
    }
    
    public function penaltyStore(Request $request) {
        $data = $request->validate([
            'description' => 'required|string|max:191',
        ]);

        Penalty::insert($data);

        return Penalty::latest('created_at')->get();
    }
    public function destroyPenalty(Request $request) {
        $penalty = Penalty::where('id', $request->id)->first();

        // Delete violation
        $penalty->delete();

        return Penalty::latest('created_at')->get();
    }
    public function update($id, Request $request) {
        if($request->type == 'program') {
            $data = $request->validate([
                'name' => 'required|string',
                'description' => 'required|string'
            ]);

            Program::where('id', $id)->update($data);
            return Program::latest('created_at')->get();
        }if($request->type == 'violation') {
            $data = $request->validate([
                'violation_name' => 'required|string|max:191',
                'offense_status' => 'required|in:1,0'
            ]);

            Violation::where('id', $id)->update($data);
            return Violation::latest('created_at')->get();
        }
        return response()->json(['message' => 'error'], 400);
    }
    public function toggle($id, Request $request) {
        if($request->type == 'program') {
            Program::where('id', $id)->update([
                'is_delete' => $request->delete
            ]);
            return Program::latest('created_at')->get();
        }if($request->type == 'violation') {
            Violation::where('id', $id)->update([
                'is_delete' => $request->delete
            ]);
            return Violation::latest('created_at')->get();
        }
        return response()->json(['message' => 'error'], 400);
    }
    public function getViolation() {
        return Violation::query()
                        ->with(['penalties' => function ($q) {
                            $q->join('penalty', 'penalty.id', '=', 'violation_penalty.penalty_id')
                            ->select(
                                'violation_penalty.*',
                                'penalty.description as penalty_description'
                            );
                        }])
                        ->latest('created_at')
                        ->get();
    }
}
