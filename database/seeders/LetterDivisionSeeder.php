<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LetterDivisionSeeder extends Seeder
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
