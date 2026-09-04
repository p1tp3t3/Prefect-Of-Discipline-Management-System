<?php

namespace Database\Factories;

use App\Models\Penalty;
use App\Models\Violation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ViolationPenalty>
 *
 * The app's real violation-to-penalty escalation ladder is seeded by
 * database/seeders/ViolationSeeder.php. This factory is for ad-hoc/test
 * links outside that ladder.
 */
class ViolationPenaltyFactory extends Factory
{
    public function definition(): array
    {
        return [
            'violation_id' => Violation::inRandomOrder()->value('id'),
            'occurrence' => $this->faker->numberBetween(1, 6),
            'penalty_id' => Penalty::inRandomOrder()->value('id'),
        ];
    }
}
