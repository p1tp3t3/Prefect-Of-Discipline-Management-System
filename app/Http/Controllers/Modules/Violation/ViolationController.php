<?php

namespace App\Http\Controllers\Modules\Violation;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Modules\Complaint\ComplaintController;
use App\Models\ActionLog;
use App\Models\Complaint;
use App\Models\ComplaintSubject;
use App\Models\ComplaintSubjectViolation;
use App\Models\Program;
use App\Models\User;
use App\Models\Violation;
use App\Models\ViolationPenalty;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ViolationController extends Controller
{
    public function violationIndex() {
        return Inertia::render('prefect/violation', [
            'user' => auth()->user(),
            'program' => Program::all(['id', 'name', 'color_code']),
            'student_violation_list' => ComplaintSubject::with([
                                            'complaint',
                                            'offenses.violation',
                                            'user.profile',
                                            'user.program',
                                            'user.enrollments',
                                            'user.teachingStaff.program'
                                        ])
                                        ->whereHas('complaint', function ($q) {
                                            $q->where('complaint_status', 'resolved');
                                        })
                                        ->get()
                                        ->groupBy(fn ($d) => $d->user->id) // ✅ GROUP BY STUDENT
                                        ->map(function ($group) {
                                            // flatten all offenses for this student
                                            $allOffenses = $group->flatMap(fn($item) => $item->offenses);
                                            $majorCount = $allOffenses
                                                        ->filter(fn ($offense) =>
                                                            optional($offense->violation)->offense_status === 1
                                                        )
                                                        ->count();
                                            $minorCount = $allOffenses
                                                        ->filter(fn ($offense) =>
                                                            optional($offense->violation)->offense_status === 0
                                                        )
                                                        ->count();

                                            return [
                                                'student_id' => $group->first()->user->id,
                                                'user' => $group->first()->user,
                                                'violation_count' => $allOffenses->count(),
                                                'major_count' => $majorCount,
                                                'minor_count' => $minorCount,
                                                'penalty_count' => $group->count(), // or custom logic
                                            ];
                                        })
                                        ->filter(fn ($item) => $item['violation_count'] > 0) 
                                        ->values()
                                    ]);
    }
    public function studentViolationIndex($id) {
        $studentViolations = ComplaintSubjectViolation::with(['violation', 'complaint'])->whereHas('complaint', function($d) {
            $d->latest('offense_issued_at');
        })
        ->where('student_id', $id);
        $violationNames = ComplaintSubjectViolation::join(
        'violation',
        'complaint_subject_violation.violation_id',
        '=',
        'violation.id'
    )
    ->where('complaint_subject_violation.student_id', $id)
    ->distinct()
    ->get(['violation.id', 'violation.violation_name']);

        return Inertia::render('other/student-violation', [
            'user' => auth()->user(),
            'student' => User::with('program')->where('id', $id)->first(),
            'student_violations' => $studentViolations->get(),
            'violations' => $violationNames
        ]);
    }
    public function studentRiskIndex($id) {
        return Inertia::render('other/student-risk-prediction', [
            'user' => auth()->user(),
            'student' => User::with('program')->where('id',  $id)->first()
        ]);
    }


    public function store(Request $request)
    {
        return self::multipleViolationStore($request);
    }
    private function multipleViolationStore($request)
    {
        DB::beginTransaction();
        $generatedFiles = [];

        try {
            $subjects = json_decode($request->subjects, true);

            if (!is_array($subjects) || empty($subjects)) {
                return response()->json(['message' => 'No subjects provided.'], 400);
            }

            // Fetch complaint
            $complaint = Complaint::with(['user.profile', 'subject.profile'])
                ->where('id', $request->id);

            $complaintId = $complaint->first()->id;
            $complaintNumber = $complaint->first()->complaint_number;
            $complaintFolder = storage_path("app/private/complaints/complaint-{$complaintNumber}");
            $subjectsFolder = "{$complaintFolder}/subjects";

            // Ensure folder exists
            if (!File::isDirectory($subjectsFolder)) {
                File::makeDirectory($subjectsFolder, 0777, true, true);
            }

            foreach ($subjects as $sub) {

                $studentId = $sub['student_id'];
                $summary   = $sub['summary'];

                // ----------------------------------------------------------------------
                // 1. SAVE or UPDATE ComplaintSubject
                // ----------------------------------------------------------------------
                ComplaintSubject::updateOrInsert(
                    [
                        'complaint_id' => $complaintId,
                        'student_id'   => $studentId,
                    ],
                    [
                        'incident_summary' => $summary,
                    ]
                );
                // ----------------------------------------------------------------------
                // 2. DELETE OLD OFFENSES for this student (fresh update)
                // ----------------------------------------------------------------------
                ComplaintSubjectViolation::where(
                    'complaint_id', $complaintId
                )
                ->where(
                    'student_id', $studentId
                )
                ->delete();

                // ----------------------------------------------------------------------
                // 3. INSERT NEW OFFENSES
                // ----------------------------------------------------------------------
                foreach ($sub['offenses'] as $off) {

                    if ($off['violation'] === "none") {
                        // Special case: no offense committed
                        ComplaintSubjectViolation::create([
                            'complaint_id' => $complaintId,
                            'student_id' => $studentId,
                            'violation_id' => null
                        ]);
                        continue;
                    } else {
                        // Normal violation
                        ComplaintSubjectViolation::create([
                            'complaint_id' => $complaintId,
                            'student_id' => $studentId,
                            'violation_id' => $off['violation']
                        ]);
                    }
                }

                // ----------------------------------------------------------------------
                // 4. Generate complaint PDF file per student
                // ----------------------------------------------------------------------
                $filePath = "{$subjectsFolder}/complaint-student-{$studentId}-{$complaintNumber}.pdf";

                $field = (new ComplaintController())->getComplaintDocumentField($complaint->first(), $summary);
                Pdf::loadView('pdf.complaint-subject', $field)->save($filePath);

                $generatedFiles[] = $filePath;

                // ----------------------------------------------------------------------
                // 5. Log Action
                // ----------------------------------------------------------------------
                ActionLog::create([
                    'user_id' => auth()->user()->id,
                    'action_type' => 'complaint',
                    'details' => "Resolved complaint for student $studentId in case #{$complaint->first()->case_number}",
                ]);
            }

            // ----------------------------------------------------------------------
            // 6. Update Complaint to RESOLVED
            // ----------------------------------------------------------------------
            $complaint->update([
                'complaint_status' => 'resolved',
                'offense_issued_at' => now(),
                'archived_at' => now()->addYears(5),
            ]);

            DB::commit();

            return response()->json(['message' => 'Complaint resolved successfully']);

        } catch (\Throwable $e) {

            DB::rollBack();

            // Remove generated files
            foreach ($generatedFiles as $file) {
                if (File::exists($file)) File::delete($file);
            }

            Log::error('Complaint resolution failed', [
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'message' => 'An error occurred while resolving the complaint.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }




    public function getStudentIncident($studentId)
    {
        $incidents = ComplaintSubject::with([
        'complaint',
        'offenses.violation' // optional if you need violation data
    ])
    ->where('student_id', $studentId)
    ->whereHas('complaint', function ($q) {
        $q->where('complaint_status', 'resolved');
    })
    ->orderByDesc(
        Complaint::select('created_at')
            ->whereColumn('complaint.id', 'complaint_subject.complaint_id')
            ->limit(1)
    )
    ->get();

return response()->json($incidents);

    }

    public function getStudentViolation($studentId = null)
    {
        $incidents = ComplaintSubject::with([
                'complaint',
                'offenses.violation',
            ])
            ->where('student_id', $studentId)
            ->whereHas('complaint', function ($q) {
                $q->where('complaint_status', 'resolved');
            })
            ->orderByDesc(
                Complaint::select('created_at')
                    ->whereColumn('complaint.id', 'complaint_subject.complaint_id') // adjust table names if different
                    ->limit(1)
            )
            ->get();

        // Build: violation => incidents[]
        $grouped = $incidents
            ->flatMap(function ($incident) use ($studentId) {
                return $incident->offenses
                    ->where('student_id', $studentId)
                    ->map(function ($offense) use ($incident, $studentId) {
                        $violation = $offense->violation;

                        if (!$violation) {
                            return null;
                        }

                        return [
                            'violation_id'   => $violation->id,
                            'violation_name' => $violation->violation_name,

                            // ✅ incident must be a list
                            'incidents' => ComplaintSubject::with('complaint.violation')
                                                           ->whereHas('complaint', function($q) use($violation) {
                                                               $q->where('incident_id', $violation->id);
                                                           })
                                                           ->where('student_id', $studentId)
                                                           ->get()
                                                           ->map(fn($d) => [
                                                               'case_number' => $d->complaint->case_number,
                                                               'incident' => $d->complaint->violation?->violation_name,
                                                               'summary' => $d->incident_summary,
                                                               'created_at' => $d->complaint->created_at,
                                                               'resolved_since' => $d->complaint->offense_issued_at,
                                                               'status' => $d->complaint->complaint_status
                                                           ]),
                            'offenses' => $incident->offenses
                                ->where('student_id', $incident->student_id)
                                ->where('violation_id', $violation->id)
                                ->map(function ($o) {
                                    return [
                                        'id'           => $o->id,
                                        'violation_id' => $o->violation_id,
                                    ];
                                })
                                ->values()
                                ->toArray(),
                        ];
                    })
                    ->filter(); // remove nulls
            })
            ->groupBy('violation_id')
            ->map(function ($rows) {
                // rows are entries with same violation_id; extract violation info once
                $first = $rows->first();

                // unique incidents by complaint_subject_id
                $incidents = $rows
                    ->unique('complaint_subject_id')
                    ->values()
                    ->toArray();

                return $first;
            })
            ->values()
            ->toArray();

        return $grouped;
    }






    public function getStudentViolationOccurence($id)
    {
        // Get all offenses committed by the student
        $records = ComplaintSubjectViolation::where('student_id', $id)
            ->with('violation') // offense has violation_id
            ->get();

        if ($records->isEmpty()) {
            return response()->json([]);
        }

        // Count occurrences by violation_id
        $occurrenceCount = [];

        foreach ($records as $rec) {
            $violationId = $rec->violation->id ?? null;
            if (!$violationId) continue;

            if (!isset($occurrenceCount[$violationId])) {
                $occurrenceCount[$violationId] = 0;
            }
            $occurrenceCount[$violationId]++;
        }

        $result = [];

        foreach ($occurrenceCount as $violationId => $count) {

            // Get the violation details (NEVER NULL NOW)
            $violationData = Violation::find($violationId);

            // Get penalty for this violation based on occurrence count
            $penaltyRecord = ViolationPenalty::with(['violation', 'penalty'])
                ->where('violation_id', $violationId)
                ->where('occurrence', '<=', $count)
                ->orderBy('occurrence', 'desc')
                ->first();

            $result[] = [
                'offense' => [
                    'violation_id' => $violationId,
                    'violation'    => $violationData,
                    'occurrences'  => $count,
                ],

                'total_occurrence' => $count,

                'penalty' => $penaltyRecord ? [
                    'occurrence_used' => $penaltyRecord->occurrence,
                    'penalty_id'      => $penaltyRecord->penalty_id,
                    'description'     => $penaltyRecord->penalty->description ?? null,
                ] : null
            ];
        }

        return $result;
    }



    public function getStudentBehaviourAnalysisResult($violation, $studentId) {
        $baseQuery = self::getModelInput($violation)
                        ->where('cs.student_id', $studentId)
                        ->groupBy('cs.student_id');
        $studentData = $baseQuery->get()->toArray()[0];
        $api = Http::withoutVerifying()->post("http://127.0.0.1:5032/python/model/predict", $studentData);
        $data = $api->json();
        $violationTimeline = ComplaintSubjectViolation::with(['violation', 'complaint.complaintSubject'])
                                                    ->where('violation_id', $violation)
                                                    ->where('student_id', $studentId)
                                                    ->orderByDesc(
                                                        Complaint::select('offense_issued_at')
                                                            ->whereColumn('complaint.id', 'complaint_subject_violation.complaint_id')
                                                            ->limit(1)
                                                    )
                                                    ->get()
                                                    ->toArray();

        return [
            'prediction' => $data['prediction'] == 1 ? 'Likely to Commit Again' : 'Unlikely to Commit Again',
            'binary' => $data['prediction'],
            'insights' => $data['insights'],
            'recommendations' => $data['reco'],
            'violation_timeline' => $violationTimeline
        ];
    }
    public function getModelInput($violation)
    {
        $recentDays  = 90;
        $ongoingDays = 30; // only used if you switch to time-window logic (optional)

        $query = DB::table('complaint as c')
            ->join('complaint_subject as cs', 'cs.complaint_id', '=', 'c.id')
            ->join('complaint_subject_violation as cso', function ($join) {
                $join->on('cso.complaint_id', '=', 'c.id')
                    ->on('cso.student_id', '=', 'cs.student_id');
            })
            ->join('violation as o', 'o.id', '=', 'cso.violation_id')
            ->where('c.complaint_status', 'resolved')
            ->where('cso.violation_id', $violation)
            ->groupBy('cs.student_id', 'o.violation_name', 'cso.violation_id')
            ->selectRaw("
                cs.student_id,
                o.violation_name AS violation_type,

                GREATEST(COUNT(*) - 1, 0) AS past_repeat_same_violation_count,

                SUM(
                    CASE
                        WHEN c.offense_issued_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
                        THEN 1 ELSE 0
                    END
                ) AS recent_same_violation_count,
                TIMESTAMPDIFF(MONTH, MAX(c.offense_issued_at), CURDATE()) AS months_since_last_same_violation,

               (
  SELECT COUNT(DISTINCT c4.id)
  FROM complaint c4
  JOIN complaint_subject cs4
    ON cs4.complaint_id = c4.id
  LEFT JOIN complaint_subject_violation cso4
    ON cso4.complaint_id = c4.id
   AND cso4.student_id = cs4.student_id
  WHERE c4.complaint_status = 'resolved'
    AND cs4.student_id = cs.student_id

    -- only after the last time student committed the SAME violation (violation_id)
    AND c4.offense_issued_at >
      (
        SELECT COALESCE(MAX(c_last.offense_issued_at), '1900-01-01')
        FROM complaint c_last
        JOIN complaint_subject cs_last
          ON cs_last.complaint_id = c_last.id
        JOIN complaint_subject_violation cso_last
          ON cso_last.complaint_id = c_last.id
         AND cso_last.student_id = cs_last.student_id
        WHERE c_last.complaint_status = 'resolved'
          AND cs_last.student_id = cs.student_id
          AND cso_last.violation_id = cso.violation_id
      )

    AND (cso4.violation_id IS NULL OR cso4.violation_id = 0)
) AS clean_streak_length,

                (
                    SELECT COUNT(*)
                    FROM complaint c3
                    JOIN complaint_subject cs3
                        ON cs3.complaint_id = c3.id
                    JOIN complaint_subject_violation cso3
                        ON cso3.complaint_id = c3.id
                    AND cso3.student_id = cs3.student_id
                    WHERE c3.complaint_status = 'ongoing'
                    AND cs3.student_id = cs.student_id
                    AND cso3.violation_id = cso.violation_id
                ) AS ongoing_same_violation_count
            ", [$recentDays]);

        return $query;
    }
}
