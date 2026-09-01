<?php

namespace App\Http\Controllers\Modules\Report;

use App\Exports\ActionLogReportExport;
use App\Exports\IncidentReportExport;
use App\Http\Controllers\Controller;
use App\Models\ActionLog;
use App\Models\Complaint;
use App\Models\ComplaintSubjectViolation;
use App\Models\ComplaintSubject;
use App\Models\Program;
use App\Models\Report;
use App\Models\User;
use App\Models\Violation;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpWord\TemplateProcessor;

class ReportController extends Controller
{
    public function index() {
        $archive = new ArchiveController();
        $top5Students = ComplaintSubjectViolation::select(
                                            'student_id',
                                            DB::raw('COUNT(*) as total_offenses')
                                        )
                                        ->with(['user.program']) 
                                        ->whereHas('complaint', function ($q) {
                                            $q->where('complaint_status', 'resolved');
                                        })
                                        ->where(function ($q) {
                                            $q->whereNotNull('violation_id');
                                        })
                                        ->groupBy('student_id')
                                        ->orderByRaw('COUNT(*) DESC')
                                        ->take(5)
                                        ->get();




        $violation = Violation::all(['id', 'violation_name']);

        $incident = Complaint::count('incident_id');
        $incidentList = Violation::all(['id', 'violation_name']);

        $resolved = Complaint::where('complaint_status', 'resolved')->count();

        
        $incidentLineGraph = Complaint::selectRaw('MONTH(created_at) as month, COUNT(*) as total')
                                      ->whereNot('complaint_status', 'pending')
                                        ->whereYear('created_at', now()->year)
                                        ->whereMonth('created_at', '<=', now()->month)
                                        ->groupBy('month')
                                        ->orderBy('month')
                                        ->pluck('total', 'month');

        $monthlyCounts = [];

        for ($i = 1; $i <= now()->month; $i++) {
            $monthlyCounts[] = $incidentLineGraph[$i] ?? 0;
        }

        $data = DB::query()
                ->fromSub(function ($q) {

                    // 🔹 Count violations PER STUDENT first
                    $q->from('complaint_subject AS cs')
                        ->join('complaint AS c', 'c.id', '=', 'cs.complaint_id')
                        ->join('complaint_subject_violation AS cso', function ($join) {
                            $join->on('cso.complaint_id', '=', 'cs.complaint_id')
                                ->on('cso.student_id', '=', 'cs.student_id');
                        })
                        ->join('enrollment AS e', function ($join) {
                            $join->on('e.student_id', '=', 'cs.student_id')
                                ->where('e.status', '=', 'enrolled');
                        })
                        ->join('program AS p', 'p.id', '=', 'e.program_id')
                        ->select(
                            'p.name AS program',
                            'cs.student_id',
                            DB::raw('COUNT(*) AS student_violations')
                        )
                        ->groupBy('p.name', 'cs.student_id');

                }, 'student_counts')
                ->select(
                    'program',

                    // ✅ unique students with violations
                    DB::raw('COUNT(student_id) AS students_with_violations'),

                    // ✅ total = SUM of each student's violations (NO DISTINCT)
                    DB::raw('SUM(student_violations) AS total_violations')
                )
                ->groupBy('program')
                ->orderByDesc('total_violations')
                ->get();




        $violationCount = ComplaintSubjectViolation::whereNotNull('violation_id')->count();
        $resolved = Complaint::where('complaint_status', 'resolved')->count();




        return Inertia::render('prefect/report', [
            'user' => auth()->user(),
            'incident' => $incident,
            'incident_line_graph' => $monthlyCounts,
            'resolution' => 0,
            'resolved' => $resolved,
            'violation_count' => $violationCount,
            'top5_students' => $top5Students,
            'report' => self::getAllReport()
                            ->orderByDesc(
                                Complaint::select('created_at')
                                    ->whereColumn('complaint.id', 'complaint_subject.complaint_id')
                            )
                            ->paginate(request('report_per_page', 20), ['*'], 'report_page'),
            'violation_report' => self::getAllReport('violation')
                            ->orderByDesc(
                                Complaint::select('offense_issued_at')
                                    ->whereColumn('complaint.id', 'complaint_subject_violation.complaint_id')
                            )
                            ->paginate(20),
            'violation_list' => $violation,
            'incident_list' => $incidentList,
            'programs' => Program::all(['id', 'name']),
            'students' => User::with('program')->where('role', 'student')->get(),
            'violation_program' => $data
        ]);
    }
    public function itrcIndex() {
        return Inertia::render('itrc/report', [
            'user' => auth()->user(),
            'students' => User::with(['profile', 'program', 'teachingStaff.program', 'parent'])->get(),
            'action_log_list' => self::getAllActionLogs()
        ]);
    }
    public function store(Request $request)
    {
        $isIncident = $request->type == 'incident';

        $incident = self::getAllReport()
            ->whereHas('complaint', function ($q) use ($request, $isIncident) {
                $q->whereBetween($isIncident ? 'complaint.created_at' : 'complaint.offense_issued_at', [$request->date_from, $request->date_to]);
            });


        /** ----------------------------------------------------
         * FILTERS
         * ----------------------------------------------------
         */

        // INDIVIDUAL student filter

        if ($request->boolean('individual')) {
            $incident = $incident->where('student_id', $request->student_id);
        } else {
            // PROGRAM filter
            if ($request->program && $request->program !== 'all') {
                $incident = $incident->whereHas('user.enrollments', function ($q) use ($request) {
                    $q->where('program_id', $request->program);
                });
            }
        }


        if($isIncident) {
            // INCIDENT type filter
            if ($request->report_type !== 'all') {
                $incident = $incident->whereHas('complaint', function ($q) use ($request) {
                    $q->where('complaint.incident_id', $request->report_type);
                });
            }
             /** ----------------------------------------------------
             * ORDER BY complaint.created_at DESC (safe rule)
             * ----------------------------------------------------
             */
            $incident = $incident->orderByDesc(
                Complaint::select('created_at')
                    ->whereColumn('complaint.id', 'complaint_subject.complaint_id')
            );
        }else {
            // VIOLATION type filter
            if ($request->report_type !== 'all') {
                $incident = $incident->whereHas('violation', function ($q) use ($request) {
                    $q->where('violation.id', $request->report_type); // <-- FIXED
                });
            }

            $incident = $incident->orderByDesc(
                Complaint::select('offense_issued_at')
                    ->whereColumn('complaint.id', 'complaint_subject_violation.complaint_id')
            );
        }
        

        $incident = $incident->get();
       

        /** ----------------------------------------------------
         * BUILD EXPORT DATA
         * ----------------------------------------------------
         */
        $excelHeader = [];
        $i = 0;


        if ($request->boolean('individual')) {

            foreach ($incident as $inc) {
                $id = ++$i;
                $reported_since = $isIncident
                                  ?
                                  Carbon::parse($inc->complaint->created_at)->format('F j, Y g:i A')
                                  :
                                  Carbon::parse($inc->complaint->offense_issued_at)->format('F j, Y g:i A');

                $excelHeader[] = $isIncident
                    ?
                    [
                        'i' => $id,
                        'complainant_name' => !is_null($inc->complaint->user) 
                                            ? $inc->complaint->user->first_name . ' ' . $inc->complaint->user->middle_name . ' ' . $inc->complaint->user->last_name 
                                            : $inc->complaint->complainant_name,
                        'incident' => $inc->complaint->violation?->violation_name,
                        'date_time' => $reported_since
                    ] :
                    [
                        'i' => $id,
                        'violation' => $inc->violation->violation_name,
                        'status' => $inc->violation->offense_status ? 'Major' : 'Minor',
                        'date_time' => $reported_since
                    ];
            }

            $excelHeader = [
                'data' => $excelHeader,
                'student' => User::with('program')->where('id', $request->student_id)->first()->toArray()
            ];

        } else {

            foreach ($incident as $inc) {
                $id = ++$i;
                $student = $inc->user;
                $reported_since = $isIncident
                                  ?
                                  Carbon::parse($inc->complaint->created_at)->format('F j, Y g:i A')
                                  :
                                  Carbon::parse($inc->complaint->offense_issued_at)->format('F j, Y g:i A');

                $data = [
                        'i' => $id,
                        'student_id' => $student->user_id,
                        'name' => $student->first_name . ' ' . $student->middle_name . ' ' . $student->last_name,
                        'program' => $student->program->name ?? '',
                        'date_time' => $reported_since
                ];
                $excelHeader[] =  $isIncident
                                  ?
                                  array_merge($data, [
                                    'complainant_name' => !is_null($inc->complaint->user) 
                                            ? $inc->complaint->user->first_name . ' ' . $inc->complaint->user->middle_name . ' ' . $inc->complaint->user->last_name 
                                            : $inc->complaint->complainant_name,
                                    'incident' => $inc->complaint->violation?->violation_name,
                                  ])
                                  :
                                  array_merge($data, [
                                    'violation' => $inc->violation->violation_name,
                                    'status' => $inc->violation->offense_status ? 'Major' : 'Minor',
                                  ]);
            }
        }

        return self::getFileType($request, $excelHeader, 'sample-file');
    }


    public function getFileType($request, $collection, $filename) {
        switch($request->file_type) {
            case 'word':
                $templatePath = public_path('docs/INCIDENT-REPORT-FORMAT_OVER-ALL.docx');
                $template = new TemplateProcessor($templatePath);

                // Set title
                $template->setValue('report_title', $request->report_name ?? 'Incident Report');

                // Clone and fill rows
                $template->cloneRow('name', count($collection));
                foreach ($collection as $index => $row) {
                    $i = $index + 1;
                    foreach ($row as $key => $value) {
                        $template->setValue("{$key}#{$i}", $value);
                    }
                }

                // Generate filenames
                $timestamp = now()->format('Ymd_His');
                $baseName = "incident-report-{$timestamp}";
                $outputDocx = public_path("{$baseName}.docx");
                $outputPdf = public_path("{$baseName}.pdf");

                // Save the filled DOCX
                $template->saveAs($outputDocx);

                // ✅ Ensure the DOCX file exists and is not empty
                if (!file_exists($outputDocx) || filesize($outputDocx) === 0) {
                    throw new \Exception("DOCX file was not generated correctly: {$outputDocx}");
                }
                // Optionally, return the file as a download
                return response()->download($outputDocx)->deleteFileAfterSend(true);
            case 'pdf':
                $reportFile = $request->boolean('individual') ? 'individual-student-incident-report' : 'incident-report';
                $props = $request->boolean('individual') ? [
                        'student_name' => $collection['student']['first_name'] . ' ' . $collection['student']['middle_name'] . ' ' . $collection['student']['last_name'],
                        'student_id' => $collection['student']['id_number'],
                        'profile_picture' => Storage::disk('public')->path("profile-pictures/{$collection['student']['profile_picture']}"),
                        'program' => $collection['student']['program']['description'] ?? '',
                        'civil_status' =>  $collection['student']['civil_status'],
                        'data' => $collection['data']
                    ] : [ 'data' => $collection ];

                $pdf = Pdf::loadView("pdf.reports.$reportFile", array_merge($props, [
                                                                'report_title' => $request->report_name,
                                                                'from' => $request->date_from,
                                                                'to' => $request->date_to
                                                            ]));
                $filePath = public_path('incident-report.pdf');

                $pdf->save($filePath);
                return response()->download($filePath)->deleteFileAfterSend(true);
            case 'excel':
                return Excel::download(
                    new IncidentReportExport(
                        collect($request->boolean('individual') ? $collection['data'] : $collection),
                        $request->report_name ?: 'Incident Report', // ← default title
                        $request->boolean('individual'),
                        $request->boolean('individual') ? $collection['student'] : null
                    ),
                    "$filename.xlsx"
                );
        }
    }
    public function generateAnalyticReport(Request $request) {
        $from = $request->date_from;
        $to = $request->date_to;

        // === Top 5 Students ===
        $top5Students = ComplaintSubjectViolation::select(
                                            'student_id',
                                            DB::raw('COUNT(*) as total_offenses')
                                        )
                                        ->with(['user.program']) 
                                        ->whereHas('complaint', function ($q) {
                                            $q->where('complaint_status', 'resolved');
                                        })
                                        ->where(function ($q) {
                                            $q->whereNotNull('violation_id');
                                        })
                                        ->groupBy('student_id')
                                        ->orderByRaw('COUNT(*) DESC')
                                        ->take(5)
                                        ->get();
        #dd($top5Students->toArray());

        // === Violations Per Program ===
$violationPerProgram = DB::query()
    ->fromSub(function ($q) use ($from, $to) {

        // 🔹 Count violations PER STUDENT first
        $q->from('complaint_subject AS cs')
            ->join('complaint AS c', 'c.id', '=', 'cs.complaint_id')
            ->join('complaint_subject_violation AS cso', function ($join) {
                $join->on('cso.complaint_id', '=', 'cs.complaint_id')
                     ->on('cso.student_id', '=', 'cs.student_id');
            })
            ->join('enrollment AS e', function ($join) {
                $join->on('e.student_id', '=', 'cs.student_id')
                    ->where('e.status', '=', 'enrolled');
            })
            ->join('program AS p', 'p.id', '=', 'e.program_id')
            ->whereBetween('c.created_at', [$from, $to])
            ->select(
                'p.name AS program',
                'cs.student_id',
                DB::raw('COUNT(*) AS student_violations')
            )
            ->groupBy('p.name', 'cs.student_id');

    }, 'student_counts')
    ->select(
        'program',

        // ✅ unique students with violations
        DB::raw('COUNT(student_id) AS students_with_violations'),

        // ✅ total = SUM of each student's violations (NO DISTINCT)
        DB::raw('SUM(student_violations) AS total_violations')
    )
    ->groupBy('program')
    ->orderByDesc('total_violations')
    ->get();


        // === Summary Data ===

        $totalViolations = ComplaintSubjectViolation::with('complaint')
                                                  ->whereHas('complaint', fn($q) => $q->whereBetween('offense_issued_at', [$from, $to]))
                                                  ->count();

        $resolved = Complaint::where('complaint_status', 'resolved')
            ->whereBetween('created_at', [$from, $to])
            ->count();

        $incidentCount = Complaint::whereBetween('created_at', [$from, $to])->count();

        // === Incident Trend (Monthly) ===
        $incidentTrend = Complaint::selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $labels = $incidentTrend->pluck('month')->map(fn($m) => \Carbon\Carbon::createFromFormat('!m', $m)->format('M'))->toArray();
        $values = $incidentTrend->pluck('total')->toArray();

        // Build chart config
        $chartConfig = [
            'type' => 'line',
            'data' => [
                'labels' => $labels,
                'datasets' => [[
                    'label' => 'Monthly Incidents',
                    'data' => $values,
                    'borderColor' => '#1a237e',
                    'backgroundColor' => 'rgba(26,35,126,0.1)',
                    'fill' => true,
                    'tension' => 0.3,
                ]],
            ],
            'options' => [
                'plugins' => [
                    'legend' => ['display' => true],
                ],
                'scales' => [
                    'y' => ['beginAtZero' => true],
                ],
            ],
        ];

        // Fetch image as base64
        $chartResponse = Http::withOptions(['verify' => false])
                             ->get('https://quickchart.io/chart', ['c' => json_encode($chartConfig)]);
        $chartBase64 = 'data:image/png;base64,' . base64_encode($chartResponse->body());

        $data = [
            'from' => $from,
            'to' => $to,
            'top5Students' => $top5Students,
            'violationPerProgram' => $violationPerProgram,
            'incidentTrend' => $incidentTrend,
            'totalViolations' => $totalViolations,
            'resolved' => $resolved,
            'incidentCount' => $incidentCount,
            'chartBase64' => $chartBase64
        ];
        $pdf = Pdf::loadView("pdf.reports.analytic-report", $data);
        $filePath = public_path('analytic-report.pdf');

        $pdf->save($filePath);
        return response()->download($filePath)->deleteFileAfterSend(true);
    }
    public function actionLogStore(Request $request) {
        $query = ActionLog::with('user.profile');

        // 🔹 Apply filters
        if ($request->report_type != 'all') {
            $query->where('action_type', $request->report_type);
        }
        $individual = (filter_var(request()->individual, FILTER_VALIDATE_BOOLEAN)) ? 1 : 0;

        if ($individual == 1) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('date_from') && $request->filled('date_to')) {
            $query->whereBetween('created_at', [$request->date_from, $request->date_to]);
        } elseif ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        } elseif ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->latest('created_at');
        $data = [];
        $collection = [];
        if($individual != 1) {
            $i = 0;
            foreach($logs->get()->toArray() as $l) {
                $profile = $l['user']['profile'] ?? [];
                $name = ($profile['first_name'] ?? '') .  ' ' . ($profile['middle_name'] ?? '') . ' ' . ($profile['last_name'] ?? '');
                $collection[] = ($request->file_type == 'excel')
                ?
                [
                    $i + 1,
                    ucwords($l['user']['id_number'] ?? ''),
                    ucwords($name),
                    ucwords($l['user']['role'] ?? ''),
                    ucwords($l['action_type']),
                    ucwords($l['details']),
                    Carbon::parse($l['created_at'])->format('F j, Y g:i A')
                ]
                :
                [
                    'i' => $i + 1,
                    'user_id' => ucwords($l['user']['id_number'] ?? ''),
                    'name' => ucwords($name),
                    'role' => ucwords($l['user']['role'] ?? ''),
                    'action_type' => ucwords($l['action_type']),
                    'details' => ucwords($l['details']),
                    'date_time' => Carbon::parse($l['created_at'])->format('F j, Y g:i A')
                ];
                $i++;
            }
            $data = [
                'data' => $collection, 
                'from' => $request->date_from, 
                'to' => $request->date_to
            ];
        }else {
            $i = 0;
            $user = $logs->first()->toArray()['user'];
            $userProfile = $user['profile'] ?? [];
            foreach($logs->get()->toArray() as $l) {
                $collection[] = ($request->file_type == 'excel')
                ?
                [
                    $i + 1,
                    ucwords($l['action_type']),
                    ucwords($l['details']),
                    Carbon::parse($l['created_at'])->format('F j, Y g:i A')
                ]
                :
                [
                    'i' => $i + 1,
                    'action_type' => ucwords($l['action_type']),
                    'details' => ucwords($l['details']),
                    'date_time' => Carbon::parse($l['created_at'])->format('F j, Y g:i A')
                ];
                $i++;
            }
            $data = [
                'data' => $collection, 
                'from' => $request->date_from, 
                'to' => $request->date_to,
                'id' => ucwords($user['id_number'] ?? ''),
                'name' => ucwords(($userProfile['first_name'] ?? '') . ' ' . ($userProfile['middle_name'] ?? '') . ' ' . ($userProfile['last_name'] ?? '')),
                'role' => ucwords($user['role'] ?? ''),
                'civil_status' => ucwords($userProfile['civil_status'] ?? ''),
                'profile_picture' => Storage::disk('public')->path("profile-pictures/{$userProfile['profile_picture']}")
            ];
        }


        //choose file pdf or excel
        ///generate the report
        //self::getActionLogFileType($request->file_type, $request->individual, $data)
        return self::getActionLogFileType($request->file_type, ($individual == 1), $data);
    }
    public function getActionLogFileType($type, $individual, $data) {
        switch($type) {
            case 'pdf':
                $file = ($individual) ? 'individual-action-log-report' : 'action-log-report';
                $output = public_path('action-log-report.pdf');
                $pdf = Pdf::loadView("pdf.reports.$file", $data);
                $pdf->save($output);
                return response()->download($output)->deleteFileAfterSend(true);
            case 'excel':
                 $fileName = $individual
                    ? 'user-action-log-' . $data['id'] . '-' . now()->format('Ymd-His') . '.xlsx'
                    : 'action-log-all-' . now()->format('Ymd-His') . '.xlsx';

                return Excel::download(new ActionLogReportExport($data, $individual), $fileName);
        }
    }

    public function update(Request $request) {
        Report::where('id', $request->id)->update([]);
        return response()->json(self::getAllReport());
    }
    public function getAllReport($type = 'incident')
    {
        $data = ($type == 'incident')
                ? new ComplaintSubject()
                : new ComplaintSubjectViolation();

        $data = $data->with([
            'user.profile',
            'user.program',
            'user.enrollments',
            'user.teachingStaff.program',
            'violation',
            'complaint.user',
            'complaint.violation'
        ])
        ->whereHas('complaint', function ($q) {
            $q->where('complaint_status', 'resolved')
              ->latest('created_at');
        });
        $data = $type == 'incident' ? $data->distinct('student_id') : $data->whereHas('violation', function($q) {$q->whereNot('violation_name', NULL);})->distinct('student_id');

        return $data;
    }




    public function getAllActionLogs() {
        $query = ActionLog::with('user.profile')->latest('created_at');

        if (request('action_type') && request('action_type') !== 'all') {
            $query->where('action_type', request('action_type'));
        }

        // Filter by date or date range
        if (request()->filled('date')) {
            // Single date filter
            $query->whereDate('created_at', request('date'));
        }

        return $query->paginate(100);
    }
    public function getReportField($request) {
        return [
            'prefect_id' => auth()->user()->id,
            'report_name' => $request->report_name,
            'report_type' => $request->report_type,
            'date_from' => $request->date_from,
            'date_to' => $request->date_to,
            'file_type' => $request->file_type,
            'description' => $request->description
        ];
    }
}
