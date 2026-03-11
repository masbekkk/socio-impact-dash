<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

final class HeadTeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // -----------------------------------------------
        // Assign Team Mappings (head_id)
        // -----------------------------------------------
        $teamMappings = [
            'Ashari@socialimpact.id' => [
                'Vina@socialimpact.id',
                'Wiranto@socialimpact.id',
                'Alfina@socialimpact.id',
                'Layla@socialimpact.id',
                'Diahayu@socialimpact.id',
                'Farhan@socialimpact.id',
                'Yansen@socialimpact.id',
                'Tsabita@socialimpact.id',
                'Ikhsan@socialimpact.id',
                'Erina@socialimpact.id',
            ],
            'Triapriansyah@socialimpact.id' => [
                'Azizah@socialimpact.id',
                'Sahrir@socialimpact.id',
                'Hanif@socialimpact.id',
                'Sabrina@socialimpact.id',
                'Dhea@socialimpact.id',
                'Fawzia@socialimpact.id',
            ],
            'Fahmi@socialimpact.id' => [
                'Fares@socialimpact.id',
                'Rafisetya@socialimpact.id',
                'Mukhtarom@socialimpact.id',
                'Yulita@socialimpact.id',
                'Zalfa@socialimpact.id',
            ],
            'Bayu@socialimpact.id' => [
                'Afan@socialimpact.id',
                'Nisrina@socialimpact.id',
                'Farhanputra@socialimpact.id',
                'Sendiputra@socialimpact.id',
            ],
            'Yudha@socialimpact.id' => [
                'Aji@socialimpact.id',
                'Regie@socialimpact.id',
                'Zaky@socialimpact.id',
                'Triska@socialimpact.id',
            ],
        ];

        foreach ($teamMappings as $headEmail => $memberEmails) {
            $headUser = User::query()->where('email', $headEmail)->first();
            if (! $headUser) {
                continue;
            }

            User::query()->whereIn('email', $memberEmails)->update(['head_id' => $headUser->id]);
        }
    }
}
