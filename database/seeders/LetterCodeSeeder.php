<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LetterCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $codes = ['SPm', 'SK', 'SPeng', 'PKS', 'SPK', 'BA', 'SPH', 'SKH', 'SERT', 'SU', 'PKWT', 'PKWTT', 'OJT', 'SPmb', 'ST', 'TAC', 'PROFORMA', 'INV', 'KWT', 'KONTRAK', 'Sertf', 'SK-PKWT', 'SK-PKWTT', 'SK-OJT', 'SK-PKLRG', 'SP', 'I', 'II', 'SPPH'];

        $uniqueCodes = array_unique($codes);

        foreach ($uniqueCodes as $code) {
            \App\Models\LetterCode::firstOrCreate(['code' => $code]);
        }
    }
}
