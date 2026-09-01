<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserPermission>
 */
class UserPermissionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'allow_complaint' => true,
            'allow_referral' => true,
            'allow_absent_form' => true,
            'allow_appointment' => true,
            'allow_gatepass' => true,
        ];
    }
}
