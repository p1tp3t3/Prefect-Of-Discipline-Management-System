<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Penalty>
 *
 * The app's real penalty catalog is seeded by database/seeders/ViolationSeeder.php.
 * This factory is for ad-hoc/test penalties outside that catalog.
 */
class PenaltyFactory extends Factory
{
    public function definition(): array
    {
        return [
            'ref_number' => $this->faker->randomFloat(2, 1, 99),
            'name' => ucfirst($this->faker->words(2, true)),
            'description' => $this->faker->sentence(4),
        ];
    }
}
