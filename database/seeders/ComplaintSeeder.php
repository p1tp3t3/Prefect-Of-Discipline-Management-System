<?php

namespace Database\Seeders;

use App\Http\Controllers\Modules\Complaint\ComplaintController;
use App\Models\Complaint;
use App\Models\ComplaintSubject;
use App\Models\ComplaintSubjectViolation;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ComplaintSeeder extends Seeder
{
    public function run(int $count = 40): void
    {
        $students = User::where('role', 'student')->pluck('id')->all();

        if (count($students) < 2) {
            $this->command?->warn('ComplaintSeeder skipped: needs at least 2 students (run StudentSeeder first).');
            return;
        }

        for ($i = 0; $i < $count; $i++) {
            $complaint = Complaint::factory()->create();

            // Subject(s): 1-2 students, always different from the complainant.
            $candidates = array_values(array_diff($students, [$complaint->complainant_id]));
            shuffle($candidates);
            $subjectIds = array_slice($candidates, 0, random_int(1, 2));

            foreach ($subjectIds as $studentId) {
                ComplaintSubject::factory()->create([
                    'complaint_id' => $complaint->id,
                    'student_id' => $studentId,
                ]);

                // A resolved complaint has a formally-determined offense per subject.
                if ($complaint->complaint_status === 'resolved') {
                    ComplaintSubjectViolation::factory()->create([
                        'complaint_id' => $complaint->id,
                        'student_id' => $studentId,
                        'violation_id' => $complaint->incident_id,
                    ]);
                }
            }

            // One form per complaint, covering every subject together —
            // only generated once resolved, matching the real app
            // (ViolationController::multipleViolationStore()).
            if ($complaint->complaint_status === 'resolved') {
                $resolved = Complaint::with(['user.profile', 'complaintSubject.user.profile'])->find($complaint->id);
                $field = (new ComplaintController())->getComplaintDocumentField($resolved, $complaint->incident_summary);

                $folder = storage_path("app/private/complaints/complaint-{$complaint->complaint_number}");
                File::ensureDirectoryExists($folder);

                Pdf::loadView('pdf.complaint-subject', $field)
                    ->save("{$folder}/complaint-{$complaint->complaint_number}.pdf");
            }
        }
    }
}
