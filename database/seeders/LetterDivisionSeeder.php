<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

final class LetterDivisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $divisions = ['BOT', 'FA', 'HR', 'PM', 'BOD', 'PKBM', 'HCM'];

        $uniqueDivisions = array_unique($divisions);

        foreach ($uniqueDivisions as $division) {
            \App\Models\LetterDivision::firstOrCreate(['code' => $division]);
        }
    }
}
