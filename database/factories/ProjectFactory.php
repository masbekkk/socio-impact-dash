<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\ProjectStatus;
use App\Enums\ProjectType;
use App\Models\Division;
use App\Models\User;
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
            'code' => 'PRJ-' . fake()->unique()->numerify('####-####'),
            'name' => fake()->words(3, true),
            'client' => fake()->company(),
            'description' => null,
            'user_id' => User::factory(),
            'division_id' => Division::factory(),
            'account_manager_id' => null,
            'head_id' => null,
            'pic_id' => null,
            'project_type' => ProjectType::Pendampingan->value,
            'status' => ProjectStatus::Draft->value,
            'sow' => null,
            'budget_total' => 0,
        ];
    }
}
