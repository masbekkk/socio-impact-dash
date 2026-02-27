<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

final class CompanyUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            ['2021060001', 'Rio Zakarias Widyandaru', 'Director'],
            ['2021060002', 'Bonafisius Parikesit', 'Board of Director'],
            ['2021110001', 'Fahmi Abdillah', 'General Manager'],
            ['2021110002', 'Justin Saputra', 'Operational Manager'],
            ['2021110003', 'Yudha Pratama', 'Project Coordinator'],
            ['2021110004', 'Indri Agstenesya', 'Project Coordinator'],
            ['2022030006', 'Nuryanto Purnama', 'CID Officer'],
            ['2022040007', 'Aan Hidayat', 'Project Coordinator'],
            ['2022060008', 'Ashari Kara', 'Project Manager'],
            ['2022060011', 'Rachma Isna Dhiar CP', 'Finance Manager and Administration'],
            ['2022080013', 'Afan Kurniawan', 'Project Manager / Social Media and Design Manager'],
            ['2023020021', 'Aji Dharma Bahari', 'CID Officer'],
            ['2023020023', 'Wiranto Wirahadikusuma F.', 'CID Officer'],
            ['2023030025', 'Steven Spalo Damoris', 'Project Coordinator'],
            ['2023030026', 'Vina Arinal Haq', 'CID Officer'],
            ['2023050027', 'Azizah Nur Aulia', 'CID Officer'],
            ['2023050029', 'Regie Firmansyah', 'CID Officer'],
            ['2023070036', 'Tri Apriansyah', 'CID Officer'],
            ['2023070037', 'Faskan Aditama', 'CID Officer'],
            ['2023070038', 'Eva Lusiana Putri', 'CID Officer'],
            ['2023070040', 'Fernando Galang Rahmadana', 'CID Officer'],
            ['2023070041', 'Zaky Gunawantoro', 'CID Officer'],
            ['2023100043', 'Sendi Putra Pratama', 'Social Media Designer'],
            ['2023100044', 'Maysri Afsari', 'Finance and Project Administration'],
            ['2023110045', 'Ahmad Sahrir', 'CID Officer'],
            ['2023110046', 'Muhammad Hanif Ridho', 'CID Officer'],
            ['2023110047', 'Muhammad Irfan Aminudin', 'CID Officer'],
            ['2024010048', 'Qahira Nazila', 'HR'],
            ['2024010049', 'Bayu Virgian Priandito', 'Videographer'],
            ['2024020050', 'Nurul Hikmah', 'CID Officer'],
            ['2024040051', 'Alfina Aulia Bintang', 'CID Officer'],
            ['2024040052', 'Endang Reforyani', 'CID Officer'],
            ['2024040053', 'Mochamad Alfares Mahendra', 'CID Officer'],
            ['2024040054', 'Rafi Setya Iqbal Pratama', 'CID Officer'],
            ['2024040055', 'Muhammad Mukhtarom Muhajir Moch', 'CID Officer'],
            ['2024070056', 'Farah Kamila Risya Utami', 'CID Officer'],
            ['2024070057', 'Aisyah Yustikaningtyas Hamadi', 'Junior Researcher'],
            ['2024080058', 'Mirra Halizah Septianna', 'Visual Designer'],
            ['2024080059', 'Ilham Akbar N.S', 'Videographer'],
            ['2024080060', 'Laylah Fiamanillah Ahmad', 'CID Officer'],
            ['2024090061', 'Asep Ridwan', 'CID Officer'],
            ['2024090062', 'Nisrina Fauziah Irtandi', 'Content Writer'],
            ['2024100063', 'Ahmad Amir', 'CID Officer'],
            ['2024100064', 'Rima Mahmuda', 'Project Coordinator'],
            ['2024100065', 'Christina Anggraeni', 'Visual Designer'],
            ['2024110066', 'Nabila Nur Haliza', 'CID Officer'],
            ['2024120067', 'Neva Mayendi Hasibuan', 'Program Officer'],
            ['2024120068', 'Dhea Putri Aryani', 'CID Officer'],
            ['2025010069', 'Yansen Affandy', 'Marketing Officer'],
            ['2025020070', 'Gilang Fajar Wibowo', 'Project Controller'],
            ['2025030071', 'Fawzia Ramadhani', 'Program Officer'],
            ['2025040072', 'Raihan Nurtriansyah Putra Dinata', 'CID Officer'],
            ['2025040073', 'Dimas Wardani', 'CID Officer'],
            ['2025040074', 'Syahrul Al-Qadar Haumahu', 'CID Officer'],
            ['2025040075', 'Rovdaian Baqrur Roji', 'CID Officer'],
            ['2025040076', 'Soni Maulana Yusup', 'CID Officer'],
            ['2025040077', 'Risma Indriani', 'CID Officer'],
            ['2025050078', 'Rafi Yasir Amri', 'CID Officer'],
            ['2025050079', 'Wiranto Wirahadikusuma F.', 'CID Officer'],
            ['2025050080', 'Muhammad \'Ammar Haikal', 'CID Officer'],
            ['2025050081', 'Tsabita Alefia Hapsari', 'CID Officer'],
            ['2025060082', 'Farhan Putra Ramadhan', 'Visual Designer'],
            ['2025060083', 'Muh. Farhan', 'CID Officer'],
            ['2025060084', 'Indri Mariska', 'Program Officer'],
            ['2025060085', 'Putu Triska Arintia Permata Putri', 'CID Officer'],
            ['2025060086', 'Ahmad Mulkan Karim', 'Videographer'],
            ['2025060087', 'Muhammad Hanif Ridho', 'Researcher'],
            ['2025070088', 'Dodi Kurniadi Wibowo', 'CID Officer'],
            ['2025070089', 'Sabrina Agistia Ritonga', 'CID Officer'],
            ['2025070090', 'Muhammad Aziz Ramdani', 'CID Officer'],
            ['2025070091', 'Ikhsan Dwi Prasetyo', 'CID Officer'],
            ['2025070092', 'Dinar Aulliyah Balqis', 'CID Officer'],
            ['2025070093', 'Yulita Dzakiyyah Rahmawati', 'Project Controller & Administrator'],
            ['2025080094', 'Erina Virdaus', 'CID Officer'],
            ['2026010095', 'Diah Ayu Asmaraning Nur Aziz', 'CID Officer'],
            ['2026020096', 'Novia Dewi Nur Qomariah', 'Secondment Community Development'],
            ['2026020097', 'Alya Ratnazafira P.', 'Sustainability Assistant'],
        ];

        foreach ($users as $userData) {
            $nip = $userData[0];
            $name = $userData[1];
            $position = $userData[2];

            // Determine Role string based on position logic
            $roleStr = UserRole::Pegawai->value;
            $posLower = strtolower($position);

            if ($posLower === 'director') {
                $roleStr = UserRole::Direktur->value;
            } elseif ($posLower === 'board of director' || str_contains($posLower, 'manager') || str_contains($posLower, 'head')) {
                $roleStr = UserRole::Head->value;
            } elseif (str_contains($posLower, 'finance')) {
                $roleStr = UserRole::Finance->value;
            } elseif (str_contains($posLower, 'hr')) {
                $roleStr = UserRole::HR->value;
            }

            // Generate email from name + nip to prevent uniqueness conflict from duplicate names
            $emailName = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '.', trim($name)));
            $emailName = trim($emailName, '.');
            $email = "{$emailName}.{$nip}@socio-impact.test";

            $user = User::firstOrCreate(
                ['nip' => $nip], 
                [   
                    'name' => $name,
                    'email' => $email,
                    'position' => $position,
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'employee_type' => \App\Enums\EmployeeType::PegawaiTetap->value,
                ]
            );

            if ($user->wasRecentlyCreated === false) {
                // Update their position and role if they already exist
                $user->update([
                    'position' => $position,
                    'name' => $name,
                    'employee_type' => \App\Enums\EmployeeType::PegawaiTetap->value,
                ]);
            }
            
            // Assign Role
            $user->syncRoles([$roleStr]);
        }
    }
}
