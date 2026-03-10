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

final class AtrSheet implements FromCollection, ShouldAutoSize, WithHeadings, WithStyles, WithTitle
{
    /**
     * @param  Collection<int, Reimbursement>  $reimbursements
     */
    public function __construct(
        private Collection $reimbursements
    ) {}

    public function title(): string
    {
        return 'ATR';
    }

    public function headings(): array
    {
        return [
            'Kode ATR',
            'Nama Pemohon',
            'NIP',
            'Project',
            'Divisi',
            'Status',
            'Urgensi',
            'Tanggal Pengajuan',
            'Tanggal Mulai',
            'Tanggal Selesai',
            'Total Nominal',
            'Kegiatan (Budget Items)',
            'Keterangan / Rencana Penggunaan',
            'Bank',
            'No. Rekening',
            'Atas Nama',
            // Approval columns
            'Head Approver',
            'Head Status',
            'Head Catatan',
            'Finance Approver',
            'Finance Status',
            'Finance Catatan',
            'Direktur Approver',
            'Direktur Status',
            'Direktur Catatan',
            // Linked EER columns
            'Kode EER',
            'Tipe EER',
            'Nominal EER',
            'Status EER',
        ];
    }

    public function collection(): Collection
    {
        return $this->reimbursements->map(function (Reimbursement $r): array {
            $headApproval = $r->approvals->first(fn ($a) => $a->role === ApprovalRole::Head);
            $financeApproval = $r->approvals->first(fn ($a) => $a->role === ApprovalRole::Finance);
            $direkturApproval = $r->approvals->first(fn ($a) => $a->role === ApprovalRole::Direktur);

            // Budget items summary
            $budgetItems = $r->atrBudgetSelecteds->map(fn ($b) => ($b->budgetDetail?->item_name ?? $b->budgetDetail?->notes ?? '-') . ' (Rp ' . number_format((float) $b->amount, 0, ',', '.') . ')')
                ->implode('; ');

            // Linked EERs
            $eers = $r->eers;
            $eerCodes = $eers->pluck('code')->implode(', ') ?: '-';
            $eerTypes = $eers->pluck('eer_type')->unique()->implode(', ') ?: '-';
            $eerNominals = $eers->count() > 0 ? $eers->sum('amount') : '-';
            $eerStatuses = $eers->map(fn ($e) => $e->status?->value ?? '-')->unique()->implode(', ') ?: '-';

            return [
                $r->code,
                $r->user?->name ?? '-',
                $r->user?->nip ?? '-',
                $r->project?->name ?? '-',
                $r->project?->division?->name ?? '-',
                $r->status?->value ?? '-',
                $r->urgency ?? '-',
                $r->created_at?->format('Y-m-d H:i') ?? '-',
                $r->start_date?->format('Y-m-d') ?? '-',
                $r->end_date?->format('Y-m-d') ?? '-',
                (float) $r->amount,
                $budgetItems ?: '-',
                $r->usage_plan ?? '-',
                $r->bank_name ?? '-',
                $r->bank_account ?? '-',
                $r->account_holder ?? '-',
                // Head
                $headApproval?->approver?->name ?? '-',
                $headApproval?->status?->value ?? '-',
                $headApproval?->notes ?? '-',
                // Finance
                $financeApproval?->approver?->name ?? '-',
                $financeApproval?->status?->value ?? '-',
                $financeApproval?->notes ?? '-',
                // Direktur
                $direkturApproval?->approver?->name ?? '-',
                $direkturApproval?->status?->value ?? '-',
                $direkturApproval?->notes ?? '-',
                // EER
                $eerCodes,
                $eerTypes,
                is_numeric($eerNominals) ? (float) $eerNominals : $eerNominals,
                $eerStatuses,
            ];
        });
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
