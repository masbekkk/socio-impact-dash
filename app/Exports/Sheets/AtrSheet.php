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

final readonly class AtrSheet implements FromCollection, ShouldAutoSize, WithHeadings, WithStyles, WithTitle
{
    /**
     * @param  Collection<int, Reimbursement>  $reimbursements
     */
    public function __construct(
        private Collection $reimbursements
    ) {}

    public function title(): string
    {
        return 'Reimbursement';
    }

    public function headings(): array
    {
        return [
            'Kode ATR',
            'Nama Pemohon',
            'NIP',
            'Kode Project',
            'Initial Project',
            'Project',
            'Divisi',
            'Status ATR',
            'Urgensi',
            'Tanggal Pengajuan',
            'Tanggal Mulai',
            'Tanggal Selesai',
            'Total Nominal ATR',
            'Nominal Ditransfer ATR',
            'Bukti Transfer ATR',
            'Detail Kegiatan',
            'Keterangan / Rencana Penggunaan',
            'Bank',
            'No. Rekening',
            'Atas Nama',
            'Cabang Bank',
            // Approval columns
            'Head Approver ATR',
            'Head Status ATR',
            'Head Catatan ATR',
            'Finance Approver ATR',
            'Finance Status ATR',
            'Finance Catatan ATR',
            'Direktur Approver ATR',
            'Direktur Status ATR',
            'Direktur Catatan ATR',
            // Linked EER columns
            'Status EER',
            'Tipe EER',
            'Nominal Selisih EER',
            'Nominal Pengeluaran EER',
            'Nominal Ditransfer EER',
            'Catatan Tambahan EER',
            'Link Excel EER',
            'Link Kwitansi EER',
            'Bukti Transfer Settlement EER',
            // EER Approvals
            'Head Approver EER',
            'Head Status EER',
            'Head Catatan EER',
            'Finance Approver EER',
            'Finance Status EER',
            'Finance Catatan EER',
            'Direktur Approver EER',
            'Direktur Status EER',
            'Direktur Catatan EER',
        ];
    }

    public function collection(): Collection
    {
        return $this->reimbursements->map(function (Reimbursement $r): array {
            $headApproval = $r->approvals->first(fn ($a): bool => $a->role === ApprovalRole::Head);
            $financeApproval = $r->approvals->first(fn ($a): bool => $a->role === ApprovalRole::Finance);
            $direkturApproval = $r->approvals->first(fn ($a): bool => $a->role === ApprovalRole::Direktur);

            // Budget items summary (showing Detail Aktivitas from notes)
            $budgetItems = $r->atrBudgetSelecteds->pluck('notes')->filter()->implode('; ');

            // Linked EERs
            $eer = $r->eers->first();

            if ($eer) {
                $eerItem = $eer->items->first();
                $eerHead = $eer->approvals->first(fn ($a): bool => $a->role === ApprovalRole::Head);
                $eerFinance = $eer->approvals->first(fn ($a): bool => $a->role === ApprovalRole::Finance);
                $eerDirektur = $eer->approvals->first(fn ($a): bool => $a->role === ApprovalRole::Direktur);

                // Find EER excel document
                $eerExcelDoc = $eer->documents->first(fn ($d): bool => $d->type === 'excel');
                $eerExcelUrl = $eerExcelDoc ? asset('storage/'.$eerExcelDoc->path) : '-';

                $eerStatus = $eer->status?->value ?? '-';
                $eerType = $eer->eer_type ?? '-';
                $eerDiff = abs((float) $eer->amount - (float) $r->amount);
                $eerNominal = (float) $eer->amount;
                $eerTransferred = (float) ($eer->transferred_amount ?? 0);
                $eerProof = $eer->transfer_proof_path ? asset('storage/'.$eer->transfer_proof_path) : '-';

                $eerItemNotes = $eerItem?->notes ?? $eer->usage_plan ?? '-';
                $eerItemReceipt = $eerItem?->receipt_path ? asset('storage/'.$eerItem->receipt_path) : '-';

                $eerHeadName = $eerHead?->approver?->name ?? '-';
                $eerHeadStatus = $eerHead?->status?->value ?? '-';
                $eerHeadNotes = $eerHead?->notes ?? '-';

                $eerFinanceName = $eerFinance?->approver?->name ?? '-';
                $eerFinanceStatus = $eerFinance?->status?->value ?? '-';
                $eerFinanceNotes = $eerFinance?->notes ?? '-';

                $eerDirekturName = $eerDirektur?->approver?->name ?? '-';
                $eerDirekturStatus = $eerDirektur?->status?->value ?? '-';
                $eerDirekturNotes = $eerDirektur?->notes ?? '-';
            } else {
                $eerStatus = '-';
                $eerType = '-';
                $eerDiff = '-';
                $eerNominal = '-';
                $eerTransferred = '-';
                $eerExcelUrl = '-';
                $eerItemNotes = '-';
                $eerItemReceipt = '-';
                $eerProof = '-';

                $eerHeadName = '-';
                $eerHeadStatus = '-';
                $eerHeadNotes = '-';

                $eerFinanceName = '-';
                $eerFinanceStatus = '-';
                $eerFinanceNotes = '-';

                $eerDirekturName = '-';
                $eerDirekturStatus = '-';
                $eerDirekturNotes = '-';
            }

            return [
                $r->code,
                $r->user?->name ?? '-',
                $r->user?->nip ?? '-',
                $r->project?->code ?? '-',
                $r->project?->initial_project ?? '-',
                $r->project?->name ?? '-',
                $r->project?->division?->name ?? '-',
                $r->status?->value ?? '-',
                $r->urgency ?? '-',
                $r->created_at?->format('Y-m-d H:i') ?? '-',
                $r->start_date?->format('Y-m-d') ?? '-',
                $r->end_date?->format('Y-m-d') ?? '-',
                (float) $r->amount,
                (float) ($r->transferred_amount ?? 0),
                $r->transfer_proof_path ? asset('storage/'.$r->transfer_proof_path) : '-',
                $budgetItems ?: '-',
                $r->usage_plan ?? '-',
                $r->bank_name ?? '-',
                $r->bank_account ?? '-',
                $r->account_holder ?? '-',
                $r->bank_branch ?? '-',
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
                // EER general info
                $eerStatus,
                $eerType,
                $eerDiff,
                $eerNominal,
                $eerTransferred,
                $eerItemNotes,
                $eerExcelUrl,
                $eerItemReceipt,
                $eerProof,
                // EER approvals
                $eerHeadName,
                $eerHeadStatus,
                $eerHeadNotes,
                $eerFinanceName,
                $eerFinanceStatus,
                $eerFinanceNotes,
                $eerDirekturName,
                $eerDirekturStatus,
                $eerDirekturNotes,
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
