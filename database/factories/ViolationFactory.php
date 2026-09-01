<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Violation>
 *
 * The app's real violation catalog is seeded by database/seeders/ViolationSeeder.php.
 * This factory is for ad-hoc/test violations outside that catalog.
 */
class ViolationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'violation_name' => ucfirst($this->faker->words(4, true)),
            'offense_status' => $this->faker->boolean(30), // ~30% major, rest minor
        ];
    }
}
