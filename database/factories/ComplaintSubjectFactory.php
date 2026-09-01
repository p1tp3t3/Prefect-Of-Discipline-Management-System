<?php

namespace Database\Factories;

use App\Models\Complaint;
use App\Models\ComplaintSubject;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\File;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ComplaintSubject>
 */
class ComplaintSubjectFactory extends Factory
{
    public function definition(): array
    {
        return [
            'complaint_id' => Complaint::factory(),
            'student_id' => User::factory(),
            'incident_summary' => null,
        ];
    }

    /**
     * Renders this subject's PDF into the complaint's subjects/ folder —
     * only here (not in ComplaintFactory) do we know which student it's for.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (ComplaintSubject $complaintSubject) {
            $complaint = Complaint::with(['user.profile', 'violation'])->find($complaintSubject->complaint_id);
            $student = User::with('profile')->find($complaintSubject->student_id);

            // Matches the real app: a subject document only exists once the
            // complaint is resolved (ViolationController::multipleViolationStore()).
            if (!$complaint || !$student || $complaint->complaint_status !== 'resolved') {
                return;
            }

            $complainantName = $complaint->user
                ? trim("{$complaint->user->profile?->first_name} {$complaint->user->profile?->middle_name} {$complaint->user->profile?->last_name}")
                : ($complaint->complainant_name ?? 'N/A');

            $data = [
                'case_number' => $complaint->case_number,
                'complainant_name' => $complainantName,
                'complainant_user_type' => strtoupper($complaint->user?->role ?? 'EXTERNAL'),
                'subject_name' => trim("{$student->profile?->first_name} {$student->profile?->middle_name} {$student->profile?->last_name}"),
                'subject_user_type' => strtoupper($student->role ?? 'STUDENT'),
                'incident' => $complaint->violation?->violation_name,
                'incident_summary' => $complaintSubject->incident_summary,
                'date_issued' => Carbon::parse($complaint->created_at)->format('F j, Y'),
            ];

            $folder = storage_path("app/private/complaints/complaint-{$complaint->complaint_number}/subjects");
            File::ensureDirectoryExists($folder);

            Pdf::loadView('pdf.complaint-subject', $data)
                ->save("{$folder}/complaint-student-{$student->id}-{$complaint->complaint_number}.pdf");
        });
    }
}
