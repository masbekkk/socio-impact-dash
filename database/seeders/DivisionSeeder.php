<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Division;
use Illuminate\Database\Seeder;

final class DivisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $divisions = [
            [
                'name' => 'Divisi Teknologi Informasi',
                'code' => 'IT',
                'description' => 'Information Technology Division',
            ],
            [
                'name' => 'Divisi Operasional',
                'code' => 'OPS',
                'description' => 'Operations Division',
            ],
            [
                'name' => 'Divisi Keuangan',
                'code' => 'FIN',
                'description' => 'Finance Division',
            ],
            [
                'name' => 'Divisi Sumber Daya Manusia',
                'code' => 'SDM',
                'description' => 'Human Resources Division',
            ],
        ];

        foreach ($divisions as $division) {
            Division::firstOrCreate(
                ['code' => $division['code']],
                $division
            );
        }
    }
}
