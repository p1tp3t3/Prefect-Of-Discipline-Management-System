<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EducationBackground>
 */
class EducationBackgroundFactory extends Factory
{
    public function definition(): array
    {
        return [
            'student_id' => User::factory(),
            'education_type' => $this->faker->randomElement(['senior_high_school', 'college']),
            'transferee' => false,
        ];
    }
}
