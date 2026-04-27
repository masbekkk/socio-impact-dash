<?php

declare(strict_types=1);

namespace App\Exports;

use App\Models\Presence;
use App\Models\User;
use App\Services\PresenceService;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

final readonly class PresenceExport implements FromQuery, ShouldAutoSize, WithHeadings, WithMapping, WithStyles
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function __construct(
        private User $user,
        private array $filters = []
    ) {}

    public function query()
    {
        $query = Presence::query()->with(['user', 'project']);

        $service = resolve(PresenceService::class);
        $service->applyFilters($query, $this->user, $this->filters);

        return $query->latest('date');
    }

    public function headings(): array
    {
        return [
            'Tanggal',
            'Nama Karyawan',
            'Email',
            'Proyek',
            'Waktu Check-in',
            'Waktu Check-out',
            'Status',
            'Kegiatan',
            'Catatan',
        ];
    }

    /**
     * @param  Presence  $presence
     */
    public function map($presence): array
    {
        $statusLabels = [
            'checked_in' => 'Hadir',
            'late' => 'Terlambat',
            'absent' => 'Alpa',
            'sick' => 'Sakit',
            'permission' => 'Izin',
            'annual_leave' => 'Cuti Tahunan',
            'field_duty' => 'Dinas Luar',
            'wfh' => 'WFH',
        ];

        return [
            $presence->date?->format('Y-m-d') ?? '-',
            $presence->user?->name ?? '-',
            $presence->user?->email ?? '-',
            $presence->project?->name ?? '-',
            $presence->check_in_at?->format('H:i') ?? '-',
            $presence->check_out_at?->format('H:i') ?? '-',
            $statusLabels[$presence->status->value] ?? $presence->status->value,
            $presence->activity ?? '-',
            $presence->notes ?? '-',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
