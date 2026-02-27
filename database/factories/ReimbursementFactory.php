<?php

declare(strict_types=1);

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reimbursement>
 */
final class ReimbursementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => 'REIM-'.mb_strtoupper($this->faker->bothify('??####')),
            'user_id' => fn () => \App\Models\User::factory(),
            'project_id' => fn () => \App\Models\Project::factory(),
            'type' => \App\Enums\ReimbursementType::ATR,
            'status' => \App\Enums\ReimbursementStatus::Submitted,
            'amount' => $this->faker->randomFloat(2, 100000, 1000000),
            'usage_plan' => $this->faker->sentence(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
