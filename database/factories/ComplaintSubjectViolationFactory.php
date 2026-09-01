<?php

namespace Database\Factories;

use App\Models\Complaint;
use App\Models\User;
use App\Models\Violation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ComplaintSubjectViolation>
 */
class ComplaintSubjectViolationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'complaint_id' => Complaint::factory(),
            'student_id' => User::factory(),
            'violation_id' => Violation::factory(),
        ];
    }
}
