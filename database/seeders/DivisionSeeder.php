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
            // PT Dampak Sosial Indonesia (Socialimpact.ID)
            [
                'name' => 'Impact & Learning (PT Dampak Sosial Indonesia (Socialimpact.ID))',
                'code' => 'impact_learning',
                'description' => 'Impact & Learning Division',
            ],
            [
                'name' => 'Marketing, Bussiness Development & Implementation (PT Dampak Sosial Indonesia (Socialimpact.ID))',
                'code' => 'marketing_bdi',
                'description' => 'Marketing & Business Development Division',
            ],
            [
                'name' => 'Divisi regional Surabaya (PT Dampak Sosial Indonesia (Socialimpact.ID))',
                'code' => 'reg_surabaya',
                'description' => 'Regional Surabaya Division',
            ],
            [
                'name' => 'Divisi regional Bali (PT Dampak Sosial Indonesia (Socialimpact.ID))',
                'code' => 'reg_bali',
                'description' => 'Regional Bali Division',
            ],
            [
                'name' => 'Divisi creative & social media (PT Dampak Sosial Indonesia (Socialimpact.ID))',
                'code' => 'creative_social',
                'description' => 'Creative & Social Media Division',
            ],
            [
                'name' => 'Divisi Human Capital (PT Dampak Sosial Indonesia (Socialimpact.ID))',
                'code' => 'human_capital',
                'description' => 'Human Capital Division',
            ],
            [
                'name' => 'Divisi Finance (PT Dampak Sosial Indonesia (Socialimpact.ID))',
                'code' => 'finance',
                'description' => 'Finance Division',
            ],

            // PT Bamboo Karya Mandiri
            [
                'name' => 'PT Bamboo Karya Mandiri',
                'code' => 'bamboo_karya_mandiri',
                'description' => 'PT Bamboo Karya Mandiri Unit',
            ],

            // Yayasan Biru Hijau Lestari
            [
                'name' => 'Divisi Partnership, Bussiness Development & Implementation (Yayasan Biru Hijau Lestari)',
                'code' => 'partnership_bdi_ybhl',
                'description' => 'Partnership & BDI Division (YBHL)',
            ],
            [
                'name' => 'Divisi Creative and Social Media (Yayasan Biru Hijau Lestari)',
                'code' => 'creative_social_ybhl',
                'description' => 'Creative & Social Media Division (YBHL)',
            ],

            // Yayasan Dampak Keberlanjutan Indonesia
            [
                'name' => 'Divisi Creative and Social Media (Yayasan Dampak Keberlanjutan Indonesia)',
                'code' => 'creative_social_ydki',
                'description' => 'Creative & Social Media Division (YDKI)',
            ],
            [
                'name' => 'Yayasan Dampak Keberlanjutan Indonesia',
                'code' => 'yayasan_dampak_keberlanjutan',
                'description' => 'Yayasan Dampak Keberlanjutan Indonesia Unit',
            ],

            // Yayasan Ekosistem Berdaya Lestari Indonesia
            [
                'name' => 'Divisi Creative and Social Media (Yayasan Ekosistem Berdaya Lestari Indonesia)',
                'code' => 'creative_social_yebli',
                'description' => 'Creative & Social Media Division (YEBLI)',
            ],
            [
                'name' => 'Yayasan Ekosistem Berdaya Lestari Indonesia',
                'code' => 'yayasan_ekosistem_berdaya',
                'description' => 'Yayasan Ekosistem Berdaya Lestari Indonesia Unit',
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
