<?php

namespace Database\Factories;

use App\Models\Program;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Enrollment>
 */
class EnrollmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'student_id' => User::factory(),
            'program_id' => Program::factory(),
            'school_year' => '2025-2026',
            'semester' => 1,
            'year_level' => $this->faker->numberBetween(1, 4),
            'status' => 'enrolled',
            'enrolled_at' => $this->faker->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'dropped_at' => null,
        ];
    }

    public function dropped(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'dropped',
            'dropped_at' => $this->faker->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
        ]);
    }
}
