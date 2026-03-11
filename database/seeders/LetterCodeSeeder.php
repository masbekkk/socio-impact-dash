<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\LetterCode;
use Illuminate\Database\Seeder;

final class LetterCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LetterCode::query()->delete();
        $codes = [
            ['code' => 'SPeng', 'description' => 'Surat pengantar'],
            ['code' => 'SPm', 'description' => 'Surat permohonan'],
            ['code' => 'SPmb', 'description' => 'Surat Pemberitahuan'],
            ['code' => 'SK', 'description' => 'Surat Keterangan'],
            ['code' => 'ST', 'description' => 'Surat Tugas'],
            ['code' => 'SPPH', 'description' => 'Permintaan penawaran harga'],
            ['code' => 'SPH', 'description' => 'Surat Penawaran harga'],
            ['code' => 'SKH', 'description' => 'Persetujuan/kesanggupan harga'],
            ['code' => 'BA', 'description' => 'Berita Acara'],
            ['code' => 'Kontrak', 'description' => 'Kontrak/PKS/SPK/MOU'],
            ['code' => 'INV', 'description' => 'Invoice'],
            ['code' => 'KWT', 'description' => 'Kuitansi'],
            ['code' => 'sert', 'description' => 'Sertifikat'],
            ['code' => 'PKWT', 'description' => 'kontrak pekerja waktu tertentu'],
            ['code' => 'PKWTT', 'description' => 'kontrak pekerja waktu tidak tertentu'],
            ['code' => 'TAC', 'description' => 'kontrak TAC'],
            ['code' => 'SP', 'description' => 'surat peringatan'],
            ['code' => 'IA', 'description' => 'Impact academy'],
            ['code' => 'LL', 'description' => 'Lestari learning'],
            ['code' => 'PKBM', 'description' => 'PKBM'],
        ];

        foreach ($codes as $codeData) {
            LetterCode::query()->updateOrCreate(['code' => $codeData['code']], ['description' => $codeData['description']]);
        }
    }
}
