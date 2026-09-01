<?php

namespace Database\Seeders;

use App\Models\Complaint;
use App\Models\ComplaintSubject;
use App\Models\ComplaintSubjectViolation;
use App\Models\User;
use Illuminate\Database\Seeder;

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
                    'incident_summary' => $complaint->complaint_status === 'resolved' ? fake()->sentence(6) : null,
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
        }
    }
}
