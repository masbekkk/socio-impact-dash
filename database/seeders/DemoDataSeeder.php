<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\ApprovalStatus;
use App\Enums\EmployeeType;
use App\Enums\LeaveStatus;
use App\Enums\LeaveType;
use App\Enums\PresenceStatus;
use App\Enums\ProjectStatus;
use App\Enums\ReimbursementStatus;
use App\Enums\ReimbursementType;
use App\Enums\UserRole;
use App\Models\AtrBudgetSelected;
use App\Models\Division;
use App\Models\DivisionCode;
use App\Models\Leave;
use App\Models\LetterCode;
use App\Models\LetterDivision;
use App\Models\LetterRequest;
use App\Models\Notification;
use App\Models\Presence;
use App\Models\Project;
use App\Models\ProjectBudgetDetail;
use App\Models\ProjectEvent;
use App\Models\Reimbursement;
use App\Models\ReimbursementApproval;
use App\Models\ReimbursementComment;
use App\Models\ReimbursementItem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

final class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        $this->clearDemoTables();
        Schema::enableForeignKeyConstraints();

        $this->seedRolesAndPermissions();

        $divisionCodes = $this->seedDivisionCodes();
        $divisions = $this->seedDivisions($divisionCodes);
        $users = $this->seedUsers($divisions);
        $letterCodes = $this->seedLetterCodes();
        $letterDivisions = $this->seedLetterDivisions();
        $projects = $this->seedProjects($users, $divisions);

        $this->seedReimbursements($users, $projects);
        $this->seedLeaves($users, $projects);
        $this->seedPresences($users, $projects);
        $this->seedLetterRequests($users, $projects, $letterCodes, $letterDivisions, $divisions);
        $this->seedNotifications($users, $projects);
    }

    private function clearDemoTables(): void
    {
        foreach ([
            'notification_recipients',
            'notifications',
            'project_event_user',
            'project_events',
            'letter_requests',
            'leave_approvals',
            'leaves',
            'presences',
            'reimbursement_comments',
            'reimbursement_items',
            'atr_budget_selecteds',
            'reimbursement_approvals',
            'reimbursement_documents',
            'reimbursements',
            'project_monitoring_documents',
            'project_monitorings',
            'project_documents',
            'project_locations',
            'project_termin_payments',
            'project_approvals',
            'project_budget_details',
            'projects',
            'letter_codes',
            'letter_divisions',
            'model_has_roles',
            'model_has_permissions',
            'role_has_permissions',
            'users',
            'divisions',
            'division_codes',
            'roles',
            'permissions',
        ] as $table) {
            if (Schema::hasTable($table)) {
                DB::table($table)->delete();
            }
        }
    }

    private function seedRolesAndPermissions(): void
    {
        $permissions = [
            'create_projects',
            'view_projects',
            'update_projects',
            'delete_projects',
            'finish_projects',
            'create_reimbursements',
            'view_reimbursements',
            'approve_reimbursements',
            'reject_reimbursements',
            'transfer_reimbursements',
            'create_leaves',
            'view_leaves',
            'view_all_leaves',
            'approve_leaves',
            'reject_leaves',
            'manage_users',
            'manage_divisions',
            'create_code_project',
            'view_audit_logs',
            'input_budget_partition',
            'approval_budget_partition',
            'manage_detail_budget',
            'create_event',
            'delete_event',
            'edit_atr_budget',
            'add_event_calendar',
            'view_all_projects',
        ];

        foreach ($permissions as $permission) {
            Permission::query()->firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $matrix = [
            UserRole::Pegawai->value => ['create_projects', 'view_projects', 'create_reimbursements', 'view_reimbursements', 'create_leaves', 'view_leaves'],
            UserRole::Head->value => ['create_projects', 'view_projects', 'update_projects', 'approve_reimbursements', 'reject_reimbursements', 'approve_leaves', 'reject_leaves', 'view_reimbursements', 'view_leaves', 'manage_detail_budget', 'create_event', 'edit_atr_budget', 'add_event_calendar'],
            UserRole::Finance->value => ['view_reimbursements', 'approve_reimbursements', 'transfer_reimbursements', 'view_projects', 'view_leaves', 'create_code_project', 'view_audit_logs', 'input_budget_partition', 'manage_detail_budget', 'edit_atr_budget', 'view_all_projects', 'create_event'],
            UserRole::HR->value => ['view_leaves', 'view_all_leaves', 'approve_leaves', 'reject_leaves', 'view_reimbursements', 'view_projects', 'view_all_projects', 'create_event', 'manage_users'],
            UserRole::Direktur->value => ['view_projects', 'view_reimbursements', 'approve_reimbursements', 'reject_reimbursements', 'view_leaves', 'view_all_leaves', 'approve_leaves', 'reject_leaves', 'approval_budget_partition', 'view_all_projects', 'create_event'],
            UserRole::Superadmin->value => $permissions,
        ];

        foreach ($matrix as $roleName => $rolePermissions) {
            Role::query()->firstOrCreate(['name' => $roleName, 'guard_name' => 'web'])
                ->syncPermissions($rolePermissions);
        }
    }

    /**
     * @return Collection<string, DivisionCode>
     */
    private function seedDivisionCodes(): Collection
    {
        return collect([
            ['code' => 'SOCIM', 'name' => 'PT Dampak Sosial Indonesia'],
            ['code' => 'BKM', 'name' => 'PT Bamboo Karya Mandiri'],
            ['code' => 'LESTARI', 'name' => 'Yayasan Biru Hijau Lestari'],
            ['code' => 'SUSTIM', 'name' => 'Yayasan Dampak Keberlanjutan Indonesia'],
        ])->mapWithKeys(fn (array $item): array => [
            $item['code'] => DivisionCode::query()->create($item),
        ]);
    }

    /**
     * @param  Collection<string, DivisionCode>  $codes
     * @return Collection<string, Division>
     */
    private function seedDivisions(Collection $codes): Collection
    {
        return collect([
            ['key' => 'learning', 'division_code_id' => $codes['SOCIM']->id, 'name' => 'Impact & Learning', 'description' => 'Riset dampak, learning design, dan evaluasi program.'],
            ['key' => 'marketing', 'division_code_id' => $codes['SOCIM']->id, 'name' => 'Marketing, Business Development & Implementation', 'description' => 'Akuisisi klien, implementasi, dan relasi mitra.'],
            ['key' => 'surabaya', 'division_code_id' => $codes['SOCIM']->id, 'name' => 'Regional Surabaya', 'description' => 'Operasional program wilayah Jawa Timur.'],
            ['key' => 'bali', 'division_code_id' => $codes['SOCIM']->id, 'name' => 'Regional Bali', 'description' => 'Operasional program wilayah Bali dan Nusa Tenggara.'],
            ['key' => 'creative', 'division_code_id' => $codes['SOCIM']->id, 'name' => 'Creative & Social Media', 'description' => 'Konten, desain, dan publikasi digital.'],
            ['key' => 'hr', 'division_code_id' => $codes['SOCIM']->id, 'name' => 'Human Capital', 'description' => 'SDM, kontrak, presensi, dan administrasi karyawan.'],
            ['key' => 'finance', 'division_code_id' => $codes['SOCIM']->id, 'name' => 'Finance', 'description' => 'Keuangan, reimbursement, nomor surat, dan billing.'],
            ['key' => 'lestari', 'division_code_id' => $codes['LESTARI']->id, 'name' => 'Lestari Program', 'description' => 'Kemitraan dan program lingkungan berkelanjutan.'],
        ])->mapWithKeys(fn (array $item): array => [
            $item['key'] => Division::query()->create([
                'division_code_id' => $item['division_code_id'],
                'name' => $item['name'],
                'description' => $item['description'],
            ]),
        ]);
    }

    /**
     * @param  Collection<string, Division>  $divisions
     * @return Collection<string, User>
     */
    private function seedUsers(Collection $divisions): Collection
    {
        $password = Hash::make('password');
        $rows = [
            ['key' => 'admin', 'name' => 'Admin Demo', 'email' => 'admin@socio-impact.test', 'nip' => '10000001', 'position' => 'System Administrator', 'role' => UserRole::Superadmin->value, 'division' => 'hr'],
            ['key' => 'direktur', 'name' => 'Rio Widyandaru', 'email' => 'direktur@socio-impact.test', 'nip' => '2021060001', 'position' => 'Director', 'role' => UserRole::Direktur->value, 'division' => 'marketing'],
            ['key' => 'finance', 'name' => 'Rachma Isna Dhiar CP', 'email' => 'finance@socio-impact.test', 'nip' => '2022060011', 'position' => 'Finance Manager', 'role' => UserRole::Finance->value, 'division' => 'finance'],
            ['key' => 'hr', 'name' => 'Qahira Nazila', 'email' => 'hr@socio-impact.test', 'nip' => '2024010048', 'position' => 'HR Manager', 'role' => UserRole::HR->value, 'division' => 'hr'],
            ['key' => 'head_learning', 'name' => 'Tri Apriansyah', 'email' => 'tri@socio-impact.test', 'nip' => '2023070036', 'position' => 'Head of Impact & Learning', 'role' => UserRole::Head->value, 'division' => 'learning'],
            ['key' => 'head_marketing', 'name' => 'Ashari Kara', 'email' => 'ashari@socio-impact.test', 'nip' => '2022060008', 'position' => 'Head of Marketing', 'role' => UserRole::Head->value, 'division' => 'marketing'],
            ['key' => 'head_bali', 'name' => 'Yudha Pratama', 'email' => 'yudha@socio-impact.test', 'nip' => '2021110003', 'position' => 'Head Regional Bali', 'role' => UserRole::Head->value, 'division' => 'bali'],
            ['key' => 'pegawai_1', 'name' => 'Aji Dharma Bahari', 'email' => 'aji@socio-impact.test', 'nip' => '2023020021', 'position' => 'CID Officer', 'role' => UserRole::Pegawai->value, 'division' => 'learning', 'head' => 'head_learning'],
            ['key' => 'pegawai_2', 'name' => 'Vina Arinal Haq', 'email' => 'vina@socio-impact.test', 'nip' => '2023030026', 'position' => 'CID Officer', 'role' => UserRole::Pegawai->value, 'division' => 'marketing', 'head' => 'head_marketing'],
            ['key' => 'pegawai_3', 'name' => 'Nisrina Fauziah', 'email' => 'nisrina@socio-impact.test', 'nip' => '2024090062', 'position' => 'Content Writer', 'role' => UserRole::Pegawai->value, 'division' => 'creative', 'head' => 'head_marketing'],
            ['key' => 'pegawai_4', 'name' => 'Fawzia Ramadhani', 'email' => 'fawzia@socio-impact.test', 'nip' => '2025030071', 'position' => 'Program Officer', 'role' => UserRole::Pegawai->value, 'division' => 'lestari', 'head' => 'head_bali'],
        ];

        $users = collect();
        foreach ($rows as $row) {
            $user = User::query()->create([
                'name' => $row['name'],
                'email' => $row['email'],
                'nip' => $row['nip'],
                'position' => $row['position'],
                'division_id' => $divisions[$row['division']]->id,
                'password' => $password,
                'email_verified_at' => now(),
                'employee_type' => EmployeeType::PegawaiTetap->value,
            ]);
            $user->assignRole($row['role']);
            $users->put($row['key'], $user);
        }

        foreach ($rows as $row) {
            if (isset($row['head'])) {
                $users[$row['key']]->update(['head_id' => $users[$row['head']]->id]);
            }
        }

        return $users;
    }

    /**
     * @return Collection<int, LetterCode>
     */
    private function seedLetterCodes(): Collection
    {
        return collect([
            ['code' => 'PKS', 'description' => 'Perjanjian Kerja Sama'],
            ['code' => 'INV', 'description' => 'Invoice dan billing'],
            ['code' => 'SPT', 'description' => 'Surat Perintah Tugas'],
            ['code' => 'UND', 'description' => 'Undangan kegiatan'],
        ])->map(fn (array $item): LetterCode => LetterCode::query()->create($item));
    }

    /**
     * @return Collection<int, LetterDivision>
     */
    private function seedLetterDivisions(): Collection
    {
        return collect([
            ['code' => 'FIN', 'description' => 'Finance'],
            ['code' => 'PRG', 'description' => 'Program'],
            ['code' => 'BDI', 'description' => 'Business Development'],
            ['code' => 'HCM', 'description' => 'Human Capital'],
        ])->map(fn (array $item): LetterDivision => LetterDivision::query()->create($item));
    }

    /**
     * @param  Collection<string, User>  $users
     * @param  Collection<string, Division>  $divisions
     * @return Collection<int, Project>
     */
    private function seedProjects(Collection $users, Collection $divisions): Collection
    {
        $rows = [
            ['code' => 'SOCIM-2026-001', 'initial' => 'KOPI', 'name' => 'Pendampingan UMKM Kopi Berdaya', 'client' => 'Bank Nusantara', 'division' => 'learning', 'head' => 'head_learning', 'pic' => 'pegawai_1', 'status' => ProjectStatus::Active, 'budget' => 450000000],
            ['code' => 'SOCIM-2026-002', 'initial' => 'RPL', 'name' => 'Riset Pemetaan Livelihood Pesisir', 'client' => 'Yayasan Laut Biru', 'division' => 'lestari', 'head' => 'head_bali', 'pic' => 'pegawai_4', 'status' => ProjectStatus::Active, 'budget' => 325000000],
            ['code' => 'SOCIM-2026-003', 'initial' => 'CSR', 'name' => 'CSR Impact Measurement Batch 2', 'client' => 'PT Energi Maju', 'division' => 'marketing', 'head' => 'head_marketing', 'pic' => 'pegawai_2', 'status' => ProjectStatus::Submitted, 'budget' => 275000000],
            ['code' => 'SOCIM-2026-004', 'initial' => 'CRT', 'name' => 'Creative Campaign Social Impact', 'client' => 'Kementerian Desa', 'division' => 'creative', 'head' => 'head_marketing', 'pic' => 'pegawai_3', 'status' => ProjectStatus::Active, 'budget' => 185000000],
            ['code' => 'SOCIM-2026-005', 'initial' => 'BALI', 'name' => 'Monitoring Program Desa Wisata Bali', 'client' => 'Pemprov Bali', 'division' => 'bali', 'head' => 'head_bali', 'pic' => 'pegawai_4', 'status' => ProjectStatus::Finished, 'budget' => 520000000],
            ['code' => 'SOCIM-2026-006', 'initial' => 'SBY', 'name' => 'Training Enumerator Surabaya', 'client' => 'UNDP Indonesia', 'division' => 'surabaya', 'head' => 'head_marketing', 'pic' => 'pegawai_2', 'status' => ProjectStatus::Active, 'budget' => 150000000],
            ['code' => 'SOCIM-2026-007', 'initial' => 'HCM', 'name' => 'Internal Capacity Building', 'client' => 'Internal Socio Impact', 'division' => 'hr', 'head' => 'hr', 'pic' => 'hr', 'status' => ProjectStatus::Active, 'budget' => 95000000],
            ['code' => 'SOCIM-2026-008', 'initial' => 'FIN', 'name' => 'Digitalisasi SOP Finance', 'client' => 'Internal Socio Impact', 'division' => 'finance', 'head' => 'finance', 'pic' => 'finance', 'status' => ProjectStatus::Draft, 'budget' => 70000000],
            ['code' => 'SOCIM-2026-009', 'initial' => 'MONEV', 'name' => 'Monev Program Sekolah Hijau', 'client' => 'Eco School Foundation', 'division' => 'learning', 'head' => 'head_learning', 'pic' => 'pegawai_1', 'status' => ProjectStatus::Active, 'budget' => 240000000],
            ['code' => 'SOCIM-2026-010', 'initial' => 'NP', 'name' => 'Non Project Management Budget', 'client' => 'Internal Socio Impact', 'division' => 'finance', 'head' => 'finance', 'pic' => 'finance', 'status' => ProjectStatus::Active, 'budget' => 80000000, 'type' => 'non-project'],
        ];

        return collect($rows)->map(function (array $row, int $index) use ($users, $divisions): Project {
            $budget = (float) $row['budget'];
            $project = Project::query()->create([
                'uuid' => (string) Str::uuid(),
                'code' => $row['code'],
                'initial_project' => $row['initial'],
                'name' => $row['name'],
                'client_name' => $row['client'],
                'description' => "Demo project untuk {$row['client']} dengan fokus {$row['name']}.",
                'division_id' => $divisions[$row['division']]->id,
                'account_manager_id' => $users['head_marketing']->id,
                'head_id' => $users[$row['head']]->id,
                'pic_id' => $users[$row['pic']]->id,
                'created_by' => $users[$row['pic']]->id,
                'status' => $row['status']->value,
                'project_type' => $row['type'] ?? 'project',
                'budget_total' => $budget,
                'operational_budget' => $budget * 0.55,
                'management_budget' => $budget * 0.25,
                'allowance_budget' => $budget * 0.12,
                'actual_budget' => $row['status'] === ProjectStatus::Finished ? $budget * 0.92 : 0,
                'budget_partition_status' => $index % 2 === 0 ? 'approved' : 'draft',
                'start_date' => now()->subMonths(5 - ($index % 4))->addDays($index)->toDateString(),
                'end_date' => now()->addMonths(2 + ($index % 5))->toDateString(),
                'lesson_learned' => $row['status'] === ProjectStatus::Finished ? 'Koordinasi awal dengan mitra lokal mempercepat validasi data lapangan.' : null,
            ]);

            $this->seedProjectChildren($project, $users, $index);

            return $project;
        });
    }

    /**
     * @param  Collection<string, User>  $users
     */
    private function seedProjectChildren(Project $project, Collection $users, int $index): void
    {
        foreach ([
            ['item_name' => 'Honor fasilitator', 'amount' => $project->operational_budget * 0.25],
            ['item_name' => 'Transportasi lapangan', 'amount' => $project->operational_budget * 0.2],
            ['item_name' => 'Workshop dan konsumsi', 'amount' => $project->operational_budget * 0.3],
            ['item_name' => 'Dokumentasi dan publikasi', 'amount' => $project->operational_budget * 0.15],
        ] as $budgetItem) {
            ProjectBudgetDetail::query()->create([
                'project_id' => $project->id,
                'item_name' => $budgetItem['item_name'],
                'quantity' => 1,
                'item_price' => $budgetItem['amount'],
                'amount' => $budgetItem['amount'],
                'amount_pelaksanaan' => $budgetItem['amount'] * 0.95,
                'amount_proposal' => $budgetItem['amount'] * 1.05,
                'notes' => "Alokasi {$budgetItem['item_name']} {$project->code}",
                'created_by' => $project->created_by,
            ]);
        }

        foreach ([
            ['latitude' => '-6.200000', 'longitude' => '106.816666', 'detail_address' => 'Jakarta'],
            ['latitude' => '-7.257472', 'longitude' => '112.752088', 'detail_address' => 'Surabaya'],
            ['latitude' => '-8.650000', 'longitude' => '115.216667', 'detail_address' => 'Denpasar'],
        ] as $location) {
            $project->locations()->create($location);
        }

        $project->terminPayments()->createMany([
            ['nominal' => $project->budget_total * 0.4, 'due_date' => $project->start_date, 'notes' => 'Termin 1 - kickoff', 'verified_by' => $users['finance']->id, 'nomor_surat' => "{$project->code}/INV/01", 'tertuju' => $project->client_name],
            ['nominal' => $project->budget_total * 0.35, 'due_date' => now()->addMonth(), 'notes' => 'Termin 2 - midline', 'verified_by' => $users['finance']->id, 'nomor_surat' => "{$project->code}/INV/02", 'tertuju' => $project->client_name],
            ['nominal' => $project->budget_total * 0.25, 'due_date' => $project->end_date, 'notes' => 'Termin 3 - final report', 'verified_by' => $users['finance']->id, 'nomor_surat' => "{$project->code}/INV/03", 'tertuju' => $project->client_name],
        ]);

        $project->documents()->createMany([
            ['type' => 'proposal', 'original_name' => "{$project->initial_project}-proposal.pdf", 'path' => "demo/projects/{$project->code}/proposal.pdf", 'mime' => 'application/pdf', 'size' => 245760, 'uploaded_by' => $project->created_by, 'upload_status' => 'completed'],
            ['type' => 'contract', 'original_name' => "{$project->initial_project}-contract.pdf", 'path' => "demo/projects/{$project->code}/contract.pdf", 'mime' => 'application/pdf', 'size' => 512000, 'uploaded_by' => $users['finance']->id, 'upload_status' => 'completed'],
        ]);

        $monitoring = $project->monitorings()->create([
            'created_by' => $project->pic_id,
            'report_date' => now()->subDays(14 - ($index % 5))->toDateString(),
            'notes' => 'Progress lapangan berjalan sesuai jadwal; beberapa aktivitas menunggu konfirmasi mitra.',
        ]);

        $monitoring->documents()->create([
            'title' => 'Laporan monitoring mingguan',
            'original_name' => "{$project->initial_project}-monitoring.pdf",
            'path' => "demo/projects/{$project->code}/monitoring.pdf",
            'mime' => 'application/pdf',
            'size' => 330000,
            'upload_status' => 'completed',
        ]);

        $event = ProjectEvent::query()->create([
            'project_id' => $project->id,
            'created_by' => $project->pic_id,
            'name' => "Rapat koordinasi {$project->initial_project}",
            'start_date' => now()->addDays($index + 2)->toDateString(),
            'end_date' => now()->addDays($index + 2)->toDateString(),
            'event_date' => now()->addDays($index + 2)->toDateString(),
            'notes' => 'Agenda koordinasi milestone dan kebutuhan data.',
        ]);
        $event->attendees()->sync([$project->pic_id, $project->head_id, $users['finance']->id]);
    }

    /**
     * @param  Collection<string, User>  $users
     * @param  Collection<int, Project>  $projects
     */
    private function seedReimbursements(Collection $users, Collection $projects): void
    {
        $statuses = [
            ReimbursementStatus::Submitted,
            ReimbursementStatus::HeadApproved,
            ReimbursementStatus::FinanceApproved,
            ReimbursementStatus::Transferred,
            ReimbursementStatus::Revision,
            ReimbursementStatus::Rejected,
        ];

        foreach ($statuses as $index => $status) {
            $project = $projects[$index];
            $detail = $project->budgetDetails()->firstOrFail();
            $amount = 4500000 + ($index * 1250000);
            $atr = Reimbursement::query()->create([
                'code' => 'ATR-2026-'.mb_str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT),
                'user_id' => $project->pic_id,
                'project_id' => $project->id,
                'type' => ReimbursementType::ATR->value,
                'status' => $status->value,
                'amount' => $amount,
                'transferred_amount' => $status === ReimbursementStatus::Transferred ? $amount : null,
                'bank_name' => 'BCA',
                'bank_account' => '1234567890',
                'account_holder' => $project->pic?->name,
                'transferred_at' => $status === ReimbursementStatus::Transferred ? now()->subDays(2) : null,
                'transfer_proof_path' => $status === ReimbursementStatus::Transferred ? 'demo/reimbursements/transfer-proof.pdf' : null,
                'rejection_reason' => $status === ReimbursementStatus::Rejected ? 'Dokumen pendukung belum sesuai.' : null,
                'usage_plan' => "Operasional kegiatan {$project->name}",
                'urgency' => $index % 2 === 0 ? 'normal' : 'tinggi',
                'start_date' => now()->addDays(3)->toDateString(),
                'end_date' => now()->addDays(5)->toDateString(),
                'replacement_pic_id' => $users['pegawai_1']->id,
            ]);

            AtrBudgetSelected::query()->create([
                'reimbursement_id' => $atr->id,
                'project_budget_detail_id' => $detail->id,
                'amount' => $amount,
                'notes' => 'Budget demo ATR',
            ]);

            $item = ReimbursementItem::query()->create([
                'reimbursement_id' => $atr->id,
                'project_budget_detail_id' => $detail->id,
                'item_name' => 'Transportasi dan akomodasi lapangan',
                'quantity' => 2,
                'unit_price' => $amount / 2,
                'amount' => $amount,
                'expense_type' => 'TRAVEL',
                'receipt_path' => 'demo/reimbursements/receipt.jpg',
                'notes' => 'Estimasi kebutuhan lapangan',
            ]);

            $this->seedReimbursementApprovals($atr, $users, $status);

            ReimbursementComment::query()->create([
                'reimbursement_id' => $atr->id,
                'user_id' => $project->pic_id,
                'comment' => $status === ReimbursementStatus::Revision ? 'Mohon revisi nominal sesuai RAB terbaru.' : 'Pengajuan dibuat untuk kebutuhan demo.',
            ]);

            if ($status === ReimbursementStatus::Transferred) {
                $eer = Reimbursement::query()->create([
                    'code' => 'EER-2026-0001',
                    'user_id' => $project->pic_id,
                    'project_id' => $project->id,
                    'atr_id' => $atr->id,
                    'type' => ReimbursementType::EER->value,
                    'eer_type' => 'refund',
                    'status' => ReimbursementStatus::Submitted->value,
                    'amount' => $amount - 350000,
                    'bank_name' => 'BCA',
                    'bank_account' => '1234567890',
                    'account_holder' => $project->pic?->name,
                    'usage_plan' => 'Pertanggungjawaban dana ATR setelah kegiatan selesai.',
                    'urgency' => 'normal',
                    'start_date' => now()->subDays(5)->toDateString(),
                    'end_date' => now()->subDays(3)->toDateString(),
                ]);

                ReimbursementItem::query()->create([
                    'reimbursement_id' => $eer->id,
                    'project_budget_detail_id' => $detail->id,
                    'parent_item_id' => $item->id,
                    'item_name' => 'Realisasi transportasi lapangan',
                    'quantity' => 1,
                    'unit_price' => $amount - 350000,
                    'amount' => $amount - 350000,
                    'expense_type' => 'TRAVEL',
                    'receipt_path' => 'demo/reimbursements/eer-receipt.jpg',
                    'notes' => 'Realisasi lebih rendah dari estimasi.',
                ]);
                $this->seedReimbursementApprovals($eer, $users, ReimbursementStatus::Submitted);
            }
        }

        $allowanceProject = $projects[6];
        $allowance = Reimbursement::query()->create([
            'code' => 'ALW-2026-0001',
            'user_id' => $users['pegawai_2']->id,
            'project_id' => $allowanceProject->id,
            'type' => ReimbursementType::ALLOWANCE->value,
            'status' => ReimbursementStatus::HeadApproved->value,
            'amount' => 1500000,
            'bank_name' => 'Mandiri',
            'bank_account' => '9988776655',
            'account_holder' => $users['pegawai_2']->name,
            'usage_plan' => 'Allowance perjalanan dinas fasilitator.',
            'urgency' => 'normal',
            'start_date' => now()->addWeek()->toDateString(),
            'end_date' => now()->addWeek()->addDays(2)->toDateString(),
        ]);
        $this->seedReimbursementApprovals($allowance, $users, ReimbursementStatus::HeadApproved);
    }

    /**
     * @param  Collection<string, User>  $users
     */
    private function seedReimbursementApprovals(Reimbursement $reimbursement, Collection $users, ReimbursementStatus $currentStatus): void
    {
        $steps = $reimbursement->type === ReimbursementType::ALLOWANCE
            ? ['head' => $users['head_marketing']->id, 'hr' => $users['hr']->id, 'direktur' => $users['direktur']->id]
            : ['head' => $users['head_learning']->id, 'finance' => $users['finance']->id, 'direktur' => $users['direktur']->id];

        foreach ($steps as $role => $approverId) {
            $status = match (true) {
                $currentStatus === ReimbursementStatus::Rejected => ApprovalStatus::Rejected,
                $currentStatus === ReimbursementStatus::Revision => ApprovalStatus::Revision,
                $currentStatus === ReimbursementStatus::Submitted => ApprovalStatus::Pending,
                $currentStatus === ReimbursementStatus::HeadApproved && $role === 'head' => ApprovalStatus::Approved,
                $currentStatus === ReimbursementStatus::FinanceApproved && in_array($role, ['head', 'finance'], true) => ApprovalStatus::Approved,
                in_array($currentStatus, [ReimbursementStatus::Transferred, ReimbursementStatus::Approved], true) => ApprovalStatus::Approved,
                default => ApprovalStatus::Pending,
            };

            ReimbursementApproval::query()->create([
                'reimbursement_id' => $reimbursement->id,
                'approver_id' => $approverId,
                'role' => $role,
                'status' => $status->value,
                'notes' => $status === ApprovalStatus::Pending ? null : 'Catatan approval demo.',
                'approved_at' => $status === ApprovalStatus::Approved ? now()->subDays(1) : null,
                'updated_by' => $status === ApprovalStatus::Approved ? $approverId : null,
            ]);
        }
    }

    /**
     * @param  Collection<string, User>  $users
     * @param  Collection<int, Project>  $projects
     */
    private function seedLeaves(Collection $users, Collection $projects): void
    {
        $rows = [
            ['code' => 'LV-2026-0001', 'user' => 'pegawai_1', 'type' => LeaveType::Annual->value, 'status' => LeaveStatus::Submitted, 'days' => [7, 9], 'reason' => 'Cuti tahunan keluarga.'],
            ['code' => 'LV-2026-0002', 'user' => 'pegawai_2', 'type' => LeaveType::Sick->value, 'status' => LeaveStatus::HeadApproved, 'days' => [3, 3], 'reason' => 'Istirahat berdasarkan surat dokter.'],
            ['code' => 'LV-2026-0003', 'user' => 'pegawai_3', 'type' => LeaveType::Travel->value, 'status' => LeaveStatus::HRApproved, 'days' => [12, 14], 'reason' => 'Perjalanan dinas monitoring konten.'],
            ['code' => 'LV-2026-0004', 'user' => 'pegawai_4', 'type' => LeaveType::Annual->value, 'status' => LeaveStatus::Revision, 'days' => [18, 19], 'reason' => 'Revisi tanggal cuti.'],
            ['code' => 'LV-2026-0005', 'user' => 'pegawai_1', 'type' => LeaveType::Unpaid->value, 'status' => LeaveStatus::Rejected, 'days' => [22, 24], 'reason' => 'Cuti tanpa gaji.'],
        ];

        foreach ($rows as $index => $row) {
            $leave = Leave::query()->create([
                'code' => $row['code'],
                'user_id' => $users[$row['user']]->id,
                'replacement_pic_id' => $users['pegawai_2']->id,
                'project_id' => $projects[$index]->id,
                'phone' => '08123456789'.$index,
                'destination' => $row['type'] === LeaveType::Travel->value ? 'Surabaya' : null,
                'lokasi' => $row['type'] === LeaveType::Travel->value ? 'Kantor mitra Surabaya' : null,
                'type' => $row['type'],
                'status' => $row['status']->value,
                'start_date' => now()->addDays($row['days'][0])->toDateString(),
                'end_date' => now()->addDays($row['days'][1])->toDateString(),
                'reason' => $row['reason'],
                'attachment_path' => 'demo/leaves/attachment.pdf',
            ]);

            foreach (['head' => 'head_learning', 'direktur' => 'direktur', 'hr' => 'hr'] as $role => $approverKey) {
                $approvalStatus = match (true) {
                    $row['status'] === LeaveStatus::Rejected => ApprovalStatus::Rejected,
                    $row['status'] === LeaveStatus::Revision => ApprovalStatus::Revision,
                    $row['status'] === LeaveStatus::Submitted => ApprovalStatus::Pending,
                    $row['status'] === LeaveStatus::HeadApproved && $role === 'head' => ApprovalStatus::Approved,
                    $row['status'] === LeaveStatus::HRApproved => ApprovalStatus::Approved,
                    default => ApprovalStatus::Pending,
                };

                $leave->approvals()->create([
                    'approver_id' => $users[$approverKey]->id,
                    'role' => $role,
                    'status' => $approvalStatus->value,
                    'notes' => $approvalStatus === ApprovalStatus::Pending ? null : 'Approval cuti demo.',
                    'approved_at' => $approvalStatus === ApprovalStatus::Approved ? now()->subDay() : null,
                ]);
            }
        }
    }

    /**
     * @param  Collection<string, User>  $users
     * @param  Collection<int, Project>  $projects
     */
    private function seedPresences(Collection $users, Collection $projects): void
    {
        $people = ['pegawai_1', 'pegawai_2', 'pegawai_3', 'pegawai_4', 'head_learning', 'finance'];
        foreach ($people as $personIndex => $key) {
            foreach (range(0, 4) as $dayIndex) {
                $status = match ($dayIndex % 4) {
                    0 => PresenceStatus::CheckedIn,
                    1 => PresenceStatus::Late,
                    2 => PresenceStatus::WorkFromHome,
                    default => PresenceStatus::FieldDuty,
                };
                $date = now()->subDays(($personIndex * 5) + $dayIndex);
                Presence::query()->create([
                    'user_id' => $users[$key]->id,
                    'project_id' => $projects[($personIndex + $dayIndex) % $projects->count()]->id,
                    'activity' => $status === PresenceStatus::WorkFromHome ? 'Menyusun laporan dan follow up mitra.' : 'Kunjungan lapangan dan koordinasi program.',
                    'date' => $date->toDateString(),
                    'status' => $status->value,
                    'check_in_at' => $date->copy()->setTime($status === PresenceStatus::Late ? 9 : 8, $status === PresenceStatus::Late ? 42 : 20),
                    'check_out_at' => $date->copy()->setTime(17, 10),
                    'check_in_latitude' => -6.2 - ($personIndex / 100),
                    'check_in_longitude' => 106.816666 + ($dayIndex / 100),
                    'check_out_latitude' => -6.19 - ($personIndex / 100),
                    'check_out_longitude' => 106.82 + ($dayIndex / 100),
                    'photo_path' => 'demo/presences/check-in.jpg',
                    'checkout_photo_path' => 'demo/presences/check-out.jpg',
                    'notes' => 'Data presensi demo.',
                ]);
            }
        }
    }

    /**
     * @param  Collection<string, User>  $users
     * @param  Collection<int, Project>  $projects
     * @param  Collection<int, LetterCode>  $letterCodes
     * @param  Collection<int, LetterDivision>  $letterDivisions
     * @param  Collection<string, Division>  $divisions
     */
    private function seedLetterRequests(Collection $users, Collection $projects, Collection $letterCodes, Collection $letterDivisions, Collection $divisions): void
    {
        foreach (range(0, 7) as $index) {
            LetterRequest::query()->create([
                'project_id' => $projects[$index]->id,
                'requester_id' => $users['pegawai_'.(($index % 4) + 1)]->id,
                'letter_date' => now()->subDays(10 - $index)->toDateString(),
                'recipient' => ['Direktur Program Mitra', 'Finance Partner', 'Kepala Dinas', 'Community Leader'][$index % 4],
                'subject' => ['Permohonan kerja sama', 'Pengajuan invoice termin', 'Undangan workshop', 'Surat tugas lapangan'][$index % 4],
                'pic_id' => $projects[$index]->pic_id,
                'division_id' => $divisions->values()[$index % $divisions->count()]->id,
                'letter_code_id' => $letterCodes[$index % $letterCodes->count()]->id,
                'letter_division_id' => $letterDivisions[$index % $letterDivisions->count()]->id,
                'keterangan' => 'Data nomor surat demo untuk kebutuhan presentasi.',
                'letter_number' => $index < 5 ? sprintf('%03d/SI/%s/VI/2026', $index + 1, $letterCodes[$index % $letterCodes->count()]->code) : null,
                'approval_status' => $index < 5 ? 'assigned' : ($index === 5 ? 'rejected' : 'pending'),
                'status' => $index % 3 === 0 ? 'unused' : 'used',
            ]);
        }
    }

    /**
     * @param  Collection<string, User>  $users
     * @param  Collection<int, Project>  $projects
     */
    private function seedNotifications(Collection $users, Collection $projects): void
    {
        foreach ($projects->take(4) as $index => $project) {
            $notification = Notification::query()->create([
                'type' => $index % 2 === 0 ? 'project_reminder' : 'approval_request',
                'title' => $index % 2 === 0 ? 'Reminder milestone proyek' : 'Approval menunggu tindakan',
                'message' => "Proyek {$project->name} memiliki aktivitas yang perlu ditindaklanjuti.",
                'reference_type' => Project::class,
                'reference_id' => $project->id,
                'priority' => $index === 0 ? 'high' : 'normal',
                'scheduled_at' => now()->addDays($index),
                'created_by' => $users['admin']->id,
            ]);

            $notification->recipients()->createMany([
                ['user_id' => $project->pic_id, 'channel' => 'email', 'status' => $index === 0 ? 'read' : 'sent', 'sent_at' => now()->subHours(2), 'read_at' => $index === 0 ? now()->subHour() : null],
                ['user_id' => $project->head_id, 'channel' => 'email', 'status' => 'sent', 'sent_at' => now()->subHours(2)],
            ]);
        }
    }
}
