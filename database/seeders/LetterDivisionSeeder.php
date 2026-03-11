<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\LetterDivision;
use Illuminate\Database\Seeder;

final class LetterDivisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LetterDivision::query()->delete();
        $divisions = ['BOD', 'HCM', 'FA', 'PM'];

        $uniqueDivisions = array_unique($divisions);

        foreach ($uniqueDivisions as $division) {
            LetterDivision::query()->firstOrCreate(['code' => $division]);
        }
    }
}
