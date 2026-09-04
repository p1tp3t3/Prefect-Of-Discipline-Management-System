<?php

namespace Database\Factories;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GatePass>
 */
class GatePassFactory extends Factory
{
    public function definition(): array
    {
        $user = User::where('role', 'student')->inRandomOrder()->first()
            ?? User::inRandomOrder()->first();

        $createdAt = $this->faker->dateTimeBetween('-6 months', 'now');
        $isConfirmed = $this->faker->boolean(70);
        $confirmedAt = $isConfirmed ? Carbon::parse($createdAt)->addHours(rand(1, 6)) : null;
        $expiration = $isConfirmed ? (clone $confirmedAt)->addHours(rand(2, 8)) : null;

        return [
            'user_id' => $user?->id,
            'reason' => $this->faker->randomElement([
                'Medical appointment',
                'Family emergency',
                'School-related errand',
                'Parent request',
                'Off-campus academic activity',
            ]),
            'allow_to' => json_encode([
                $this->faker->randomElement(['Guardian pick-up', 'Solo release', 'With companion']),
            ]),
            'confirmed_at' => $confirmedAt,
            'date_expiration' => $expiration,
            'created_at' => $createdAt,
        ];
    }
}
