<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\DivisionCode;
use Illuminate\Database\Seeder;

final class DivisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $divisions = [
            // PT Dampak Sosial Indonesia (Socialimpact.ID)
            [
                'name' => 'Impact & Learning (PT Dampak Sosial Indonesia (Socialimpact.ID))',
                'code' => 'Socim.id',
                'description' => 'Impact & Learning Division',
            ],
            [
                'name' => 'Marketing, Bussiness Development & Implementation (PT Dampak Sosial Indonesia (Socialimpact.ID))',
                'code' => 'Socim.id',
                'description' => 'Marketing & Business Development Division',
            ],
            [
                'name' => 'Divisi regional Surabaya (PT Dampak Sosial Indonesia (Socialimpact.ID))',
                'code' => 'Socim.id',
                'description' => 'Regional Surabaya Division',
            ],
            [
                'name' => 'Divisi regional Bali (PT Dampak Sosial Indonesia (Socialimpact.ID))',
                'code' => 'Socim.id',
                'description' => 'Regional Bali Division',
            ],
            [
                'name' => 'Divisi creative & social media (PT Dampak Sosial Indonesia (Socialimpact.ID))',
                'code' => 'Socim.id',
                'description' => 'Creative & Social Media Division',
            ],
            [
                'name' => 'Divisi Human Capital (PT Dampak Sosial Indonesia (Socialimpact.ID))',
                'code' => 'Socim.id',
                'description' => 'Human Capital Division',
            ],
            [
                'name' => 'Divisi Finance (PT Dampak Sosial Indonesia (Socialimpact.ID))',
                'code' => 'Socim.id',
                'description' => 'Finance Division',
            ],

            // PT Bamboo Karya Mandiri
            [
                'name' => 'PT Bamboo Karya Mandiri',
                'code' => 'BKM',
                'description' => 'PT Bamboo Karya Mandiri Unit',
            ],

            // Yayasan Biru Hijau Lestari
            [
                'name' => 'Divisi Partnership, Bussiness Development & Implementation (Yayasan Biru Hijau Lestari)',
                'code' => 'Lestari',
                'description' => 'Partnership & BDI Division (YBHL)',
            ],
            [
                'name' => 'Divisi Creative and Social Media (Yayasan Biru Hijau Lestari)',
                'code' => 'Lestari',
                'description' => 'Creative & Social Media Division (YBHL)',
            ],

            // Yayasan Dampak Keberlanjutan Indonesia
            [
                'name' => 'Divisi Creative and Social Media (Yayasan Dampak Keberlanjutan Indonesia)',
                'code' => 'Sustim.id',
                'description' => 'Creative & Social Media Division (YDKI)',
            ],
            [
                'name' => 'Yayasan Dampak Keberlanjutan Indonesia',
                'code' => 'Sustim.id',
                'description' => 'Yayasan Dampak Keberlanjutan Indonesia Unit',
            ],

            // Yayasan Ekosistem Berdaya Lestari Indonesia
            [
                'name' => 'Divisi Creative and Social Media (Yayasan Ekosistem Berdaya Lestari Indonesia)',
                'code' => 'Lestari',
                'description' => 'Creative & Social Media Division (YEBLI)',
            ],
            [
                'name' => 'Yayasan Ekosistem Berdaya Lestari Indonesia',
                'code' => 'Lestari',
                'description' => 'Yayasan Ekosistem Berdaya Lestari Indonesia Unit',
            ],
        ];

        $companyNames = [
            'Socim.id' => 'PT Dampak Sosial Indonesia',
            'BKM' => 'PT Bamboo Karya Mandiri',
            'Lestari' => 'Lestari',
            'Sustim.id' => 'Yayasan Dampak Keberlanjutan Indonesia',
        ];

        foreach ($divisions as $divisionData) {
            $divisionCode = DivisionCode::query()->firstOrCreate(['code' => $divisionData['code']], ['name' => $companyNames[$divisionData['code']] ?? $divisionData['code']]);

            $divisionCode->divisions()->firstOrCreate([
                'name' => $divisionData['name'],
                'description' => $divisionData['description'],
            ]);
        }
    }
}
