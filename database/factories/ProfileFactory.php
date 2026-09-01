<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Profile>
 */
class ProfileFactory extends Factory
{
    public function definition(): array
    {
        $sex = $this->faker->randomElement(['m', 'f']);

        return [
            'user_id' => User::factory(),
            'first_name' => $this->faker->firstName($sex === 'm' ? 'male' : 'female'),
            'middle_name' => $this->faker->lastName(),
            'last_name' => $this->faker->lastName(),
            'sex' => $sex,
            'date_of_birth' => $this->faker->dateTimeBetween('-24 years', '-17 years')->format('Y-m-d'),
            'civil_status' => 'single',
            'current_address' => $this->faker->address(),
            'permanent_address' => $this->faker->address(),
            'contact_number' => '09' . $this->faker->numerify('#########'),
        ];
    }
}
