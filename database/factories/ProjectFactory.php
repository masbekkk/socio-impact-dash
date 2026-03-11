<?php

declare(strict_types=1);

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
final class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => 'PRJ-'.mb_strtoupper($this->faker->bothify('??####')),
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'created_by' => fn () => \App\Models\User::query()->role(\App\Enums\UserRole::Pegawai->value)->inRandomOrder()->first()?->id ?? \App\Models\User::factory(),
            'division_id' => fn () => \App\Models\Division::query()->inRandomOrder()->first()?->id ?? \App\Models\Division::factory(),
            'account_manager_id' => fn () => \App\Models\User::query()->role(\App\Enums\UserRole::Pegawai->value)->inRandomOrder()->first()?->id ?? \App\Models\User::factory(),
            'head_id' => fn () => \App\Models\User::query()->role(\App\Enums\UserRole::Head->value)->inRandomOrder()->first()?->id ?? \App\Models\User::factory(),
            'pic_id' => fn () => \App\Models\User::query()->role(\App\Enums\UserRole::Pegawai->value)->inRandomOrder()->first()?->id ?? \App\Models\User::factory(),
            'status' => $this->faker->randomElement(['draft', 'submitted', 'active', 'finished', 'archived']),
            'project_type' => $this->faker->randomElement(['pendampingan', 'pelatihan', 'dokumen', 'event']),
            'budget_total' => $total = $this->faker->randomFloat(2, 10000000, 1000000000),
            'operational_budget' => $total * 0.5,
            'management_budget' => $total * 0.3,
            'allowance_budget' => $total * 0.2,
            'actual_budget' => null,
            'start_date' => $this->faker->dateTimeBetween('now', '+1 month'),
            'end_date' => $this->faker->dateTimeBetween('+2 months', '+6 months'),
        ];
    }
}
