<?php

declare(strict_types=1);

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Leave>
 */
final class LeaveFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => 'LV-' . $this->faker->unique()->numberBetween(1000, 9999),
            'user_id' => \App\Models\User::factory(),
            'type' => \App\Enums\LeaveType::Annual,
            'status' => \App\Enums\LeaveStatus::Submitted,
            'start_date' => now()->addDays(7),
            'end_date' => now()->addDays(10),
            'reason' => $this->faker->sentence(),
        ];
    }
}
