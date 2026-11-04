<?php

declare(strict_types=1);

namespace App\Exports\Sheets;

use App\Enums\ApprovalRole;
use App\Models\Reimbursement;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

final readonly class AllowanceSheet implements FromCollection, ShouldAutoSize, WithHeadings, WithStyles, WithTitle
{
    /**
     * @param  Collection<int, Reimbursement>  $reimbursements
     */
    public function __construct(private Collection $reimbursements) {}

    public function title(): string
    {
        return 'Allowance';
    }

    public function headings(): array
    {
        return [
            'Kode Allowance', 'Nama Pemohon', 'NIP', 'Kode Project', 'Initial Project',
            'Project', 'Divisi', 'Status', 'Tanggal Pengajuan', 'Tanggal Mulai',
            'Tanggal Selesai', 'Nominal', 'Nominal Ditransfer', 'Bukti Transfer',
            'Keterangan / Rencana Penggunaan', 'Bank', 'No. Rekening', 'Atas Nama',
            'Cabang Bank', 'Head Approver', 'Head Status', 'Head Catatan',
            'HR Approver', 'HR Status', 'HR Catatan',
            'Finance Approver', 'Finance Status', 'Finance Catatan',
            'Direktur Approver', 'Direktur Status', 'Direktur Catatan',
        ];
    }

    public function collection(): Collection
    {
        return $this->reimbursements->map(function (Reimbursement $reimbursement): array {
            $approvals = $reimbursement->approvals;
            $head = $approvals->first(fn ($approval): bool => $approval->role === ApprovalRole::Head);
            $hr = $approvals->first(fn ($approval): bool => $approval->role === ApprovalRole::HR);
            $finance = $approvals->first(fn ($approval): bool => $approval->role === ApprovalRole::Finance);
            $direktur = $approvals->first(fn ($approval): bool => $approval->role === ApprovalRole::Direktur);

            return [
                $reimbursement->code,
                $reimbursement->user?->name ?? '-',
                $reimbursement->user?->nip ?? '-',
                $reimbursement->project?->code ?? '-',
                $reimbursement->project?->initial_project ?? '-',
                $reimbursement->project?->name ?? '-',
                $reimbursement->project?->division?->name ?? '-',
                $reimbursement->status?->value ?? '-',
                $reimbursement->created_at?->format('Y-m-d H:i') ?? '-',
                $reimbursement->start_date?->format('Y-m-d') ?? '-',
                $reimbursement->end_date?->format('Y-m-d') ?? '-',
                (float) $reimbursement->amount,
                (float) ($reimbursement->transferred_amount ?? 0),
                $reimbursement->transfer_proof_path ? asset('storage/'.$reimbursement->transfer_proof_path) : '-',
                $reimbursement->usage_plan ?? '-',
                $reimbursement->bank_name ?? '-',
                $reimbursement->bank_account ?? '-',
                $reimbursement->account_holder ?? '-',
                $reimbursement->bank_branch ?? '-',
                $head?->approver?->name ?? '-',
                $head?->status?->value ?? '-',
                $head?->notes ?? '-',
                $hr?->approver?->name ?? '-',
                $hr?->status?->value ?? '-',
                $hr?->notes ?? '-',
                $finance?->approver?->name ?? '-',
                $finance?->status?->value ?? '-',
                $finance?->notes ?? '-',
                $direktur?->approver?->name ?? '-',
                $direktur?->status?->value ?? '-',
                $direktur?->notes ?? '-',
            ];
        });
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true]]];
    }
}
