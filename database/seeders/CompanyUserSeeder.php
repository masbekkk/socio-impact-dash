<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

final class CompanyUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Delete all users and their role assignments to allow clean reseeding
        DB::table('model_has_roles')->where('model_type', User::class)->delete();
        User::query()->delete();

        // ----------------------------------------------------
        // General Test Accounts (from legacy UserSeeder.php)
        // ----------------------------------------------------

        // Create admin user
        $admin = User::query()->firstOrCreate(['email' => 'admin@socio-impact.test'], [
            'name' => 'Admin User',
            'nip' => '10000001',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'employee_type' => \App\Enums\EmployeeType::PegawaiTetap->value,
        ]);
        $admin->assignRole(UserRole::Superadmin->value);

        // Create head user
        // $head = User::firstOrCreate(
        //     ['email' => 'head@socio-impact.test'],
        //     [
        //         'name' => 'Department Head',
        //         'nip' => '10000002',
        //         'password' => Hash::make('password'),
        //         'email_verified_at' => now(),
        //         'employee_type' => \App\Enums\EmployeeType::PegawaiTetap->value,
        //     ]
        // );
        // $head->assignRole(UserRole::Head->value);

        // Create finance user
        $finance = User::query()->firstOrCreate(['email' => 'finance@socio-impact.test'], [
            'name' => 'Finance Officer',
            'nip' => '10000003',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'employee_type' => \App\Enums\EmployeeType::PegawaiTetap->value,
        ]);
        $finance->assignRole(UserRole::Finance->value);

        // Create HR user
        $hr = User::query()->firstOrCreate(['email' => 'hr@socio-impact.test'], [
            'name' => 'HR Manager',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'employee_type' => \App\Enums\EmployeeType::PegawaiTetap->value,
        ]);
        $hr->assignRole(UserRole::HR->value);

        // Create 10 regular employees
        // for ($i = 1; $i <= 10; $i++) {
        //     $nip = str_pad((string)(10000003 + $i), 8, '0', STR_PAD_LEFT);

        //     $user = User::firstOrCreate(
        //         ['email' => "pegawai{$i}@socio-impact.test"],
        //         [
        //             'name' => "Pegawai {$i}",
        //             'nip' => $nip,
        //             'password' => Hash::make('password'),
        //             'email_verified_at' => now(),
        //             'employee_type' => \App\Enums\EmployeeType::PegawaiTetap->value,
        //         ]
        //     );

        //     $user->assignRole(UserRole::Pegawai->value);
        // }

        $direktur = User::query()->firstOrCreate(['email' => 'direktur@socio-impact.test'], [
            'name' => 'Direktur User',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'employee_type' => \App\Enums\EmployeeType::PegawaiTetap->value,
        ]);
        $direktur->assignRole(UserRole::Direktur->value);

        // ----------------------------------------------------
        // Company Staff Accounts
        // ----------------------------------------------------

        $users = [
            ['2021060001', 'Rio Zakarias Widyandaru', 'Director', 'Riowidyandaru@socialimpact.id'],
            ['2021110001', 'Fahmi Abdillah', 'Head of Regional Surabaya', 'Fahmi@socialimpact.id'],
            ['2021110003', 'Yudha Pratama', 'Head of Regional Bali', 'Yudha@socialimpact.id'],
            ['2022030006', 'Nuryanto Purnama', 'CID Officer', 'Nuryanto@socialimpact.id'],
            ['2022060008', 'Ashari Kara', 'Head of Marketing, Bussines Development, & Implementation', 'Ashari@socialimpact.id'],
            ['2022060011', 'Rachma Isna Dhiar CP', 'Finance Manager and Administration', 'Rachma@socialimpact.id'],
            ['2022080013', 'Afan Kurniawan', 'Project Manager / Social Media and Design Manager', 'Afan@socialimpact.id'],
            ['2023020021', 'Aji Dharma Bahari', 'CID Officer', 'Aji@socialimpact.id'],
            ['2023020023', 'Wiranto Wirahadikusuma F.', 'CID Officer', 'Wiranto@socialimpact.id'],
            ['2023030026', 'Vina Arinal Haq', 'CID Officer', 'Vina@socialimpact.id'],
            ['2023050027', 'Azizah Nur Aulia', 'CID Officer', 'Azizah@socialimpact.id'],
            ['2023050029', 'Regie Firmansyah', 'CID Officer', 'Regie@socialimpact.id'],
            ['2023070036', 'Tri Apriansyah', 'Head of Impact & Learning', 'Triapriansyah@socialimpact.id'],
            ['2023070040', 'Fernando Galang Rahmadana', 'Head of Lestari', 'Fernando@socialimpact.id'],
            ['2023070041', 'Zaky Gunawantoro', 'CID Officer', 'Zaky@socialimpact.id'],
            ['2023100043', 'Sendi Putra Pratama', 'Social Media Designer', 'Sendiputra@socialimpact.id'],
            ['2023100044', 'Maysri Afsari', 'Finance and Project Administration', 'Maysri@socialimpact.id'],
            ['2023110045', 'Ahmad Sahrir', 'CID Officer', 'Sahrir@socialimpact.id'],
            ['2023110046', 'Muhammad Hanif Ridho', 'CID Officer', 'Hanif@socialimpact.id'],
            ['2023110047', 'Muhammad Irfan Aminudin', 'CID Officer', 'Irfan@socialimpact.id'],
            ['2024010048', 'Qahira Nazila', 'HR', 'Zila@socialimpact.id'],
            ['2024010049', 'Bayu Virgian Priandito', 'Head Of Creative', 'Bayu@socialimpact.id'],
            ['2024020050', 'Nurul Hikmah', 'CID Officer', 'Nurul@socialimpact.id'],
            ['2024040051', 'Alfina Aulia Bintang', 'CID Officer', 'Alfina@socialimpact.id'],
            ['2024040052', 'Endang Reforyani', 'CID Officer', 'Endang@socialimpact.id'],
            ['2024040053', 'Mochamad Alfares Mahendra', 'CID Officer', 'Fares@socialimpact.id'],
            ['2024040054', 'Rafi Setya Iqbal Pratama', 'CID Officer', 'Rafisetya@socialimpact.id'],
            ['2024040055', 'Muhammad Mukhtarom Muhajir Mocha', 'CID Officer', 'Mukhtarom@socialimpact.id'],
            ['2024080060', 'Laylah Fiamanillah Ahmad', 'CID Officer', 'Layla@socialimpact.id'],
            ['2024090062', 'Nisrina Fauziah Irtandi', 'Content Writer', 'Nisrina@socialimpact.id'],
            ['2024100065', 'Christina Anggraeni', 'Visual Designer', 'Christina@socialimpact.id'],
            ['2024120067', 'Neva Mayendi Hasibuan', 'Program Officer', 'Neva@socialimpact.id'],
            ['2024120068', 'Dhea Putri Aryani', 'CID Officer', 'Dhea@socialimpact.id'],
            ['2025010069', 'Yansen Affandy', 'Marketing Officer', 'Yansen@socialimpact.id'],
            ['2025030071', 'Fawzia Ramadhani', 'Program Officer', 'Fawzia@socialimpact.id'],
            ['2025050081', 'Tsabita Alefia Hapsari', 'CID Officer', 'Tsabita@socialimpact.id'],
            ['2025060082', 'Farhan Putra Ramadhan', 'Visual Designer', 'Farhanputra@socialimpact.id'],
            ['2025060083', 'Muh. Farhan', 'CID Officer', 'Farhan@socialimpact.id'],
            ['2025060085', 'Putu Triska Arintia Permata Putri', 'CID Officer', 'Triska@socialimpact.id'],
            ['2025070089', 'Sabrina Agistia Ritonga', 'CID Officer', 'Sabrina@socialimpact.id'],
            ['2025070091', 'Ikhsan Dwi Prasetyo', 'CID Officer', 'Ikhsan@socialimpact.id'],
            ['2025070093', 'Yulita Dzakiyyah Rahmawati', 'Project Controller & Administrator', 'Yulita@socialimpact.id'],
            ['2025080094', 'Erina Virdaus', 'CID Officer', 'Erina@socialimpact.id'],
            ['2026010095', 'Diah Ayu Asmaraning Nur Aziz', 'CID Officer', 'Diahayu@socialimpact.id'],
            ['2026020097', 'Alya Ratnazafira P.', 'Sustainability Assistant', 'Alya@socialimpact.id'],
            ['2026020098', 'Zalfa Salsabil Dalilah Cameleon', 'CID Officer', 'Zalfa@socialimpact.id'],
        ];

        foreach ($users as $userData) {
            $nip = $userData[0];
            $name = $userData[1];
            $position = $userData[2];
            $email = $userData[3];

            // Determine Role string based on position logic
            $roleStr = UserRole::Pegawai->value;
            $posLower = mb_strtolower($position);

            $empType = \App\Enums\EmployeeType::PegawaiTetap->value;
            if ($posLower === 'intern') {
                $empType = \App\Enums\EmployeeType::Intern->value;
            }

            if ($posLower === 'director') {
                $roleStr = UserRole::Direktur->value;
            } elseif ($posLower === 'board of director' || str_contains($posLower, 'manager') || str_contains($posLower, 'head')) {
                $roleStr = UserRole::Head->value;
            } elseif (str_contains($posLower, 'finance')) {
                $roleStr = UserRole::Finance->value;
            } elseif (str_contains($posLower, 'hr')) {
                $roleStr = UserRole::HR->value;
            }

            $user = User::query()->firstOrCreate(['nip' => $nip], [
                'name' => $name,
                'email' => $email,
                'position' => $position,
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'employee_type' => $empType,
            ]);

            if ($user->wasRecentlyCreated === false) {
                // Update their position and role if they already exist
                $user->update([
                    'position' => $position,
                    'name' => $name,
                    'email' => $email,
                    'employee_type' => $empType,
                ]);
            }

            // Assign Role
            $user->syncRoles([$roleStr]);
        }
    }
}
