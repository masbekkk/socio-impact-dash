<?php

declare(strict_types=1);

namespace App\Exports\Sheets;

use App\Enums\ApprovalRole;
use App\Models\Reimbursement;
use App\Models\ReimbursementItem;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

final readonly class EerSheet implements FromCollection, ShouldAutoSize, WithHeadings, WithStyles, WithTitle
{
    /**
     * @param  Collection<int, Reimbursement>  $reimbursements
     */
    public function __construct(
        private Collection $reimbursements
    ) {}

    public function title(): string
    {
        return 'EER';
    }

    public function headings(): array
    {
        return [
            'Kode EER',
            'Kode ATR Terkait',
            'Nama Pemohon',
            'NIP',
            'Kode Project',
            'Initial Project',
            'Project',
            'Divisi',
            'Status',
            'Tipe EER',
            'Nominal Refund/Reimbursement',
            'Total Nominal EER',
            'Nominal Ditransfer',
            'Bukti Transfer Settlement',
            // Item columns
            'Nama Item',
            'Qty',
            'Harga Satuan',
            'Total Item',
            'Expense Type',
            'Catatan Item',
            'Link Kwitansi',
            // Bank
            'Bank',
            'No. Rekening',
            'Atas Nama',
            'Cabang Bank',
            'Tanggal Pengajuan',
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
        ];
    }

    public function collection(): Collection
    {
        $rows = collect();

        foreach ($this->reimbursements as $r) {
            $headApproval = $r->approvals->first(fn ($a): bool => $a->role === ApprovalRole::Head);
            $financeApproval = $r->approvals->first(fn ($a): bool => $a->role === ApprovalRole::Finance);
            $direkturApproval = $r->approvals->first(fn ($a): bool => $a->role === ApprovalRole::Direktur);

            $items = $r->items;

            if ($items->isEmpty()) {
                // One row for the EER with no items
                $rows->push($this->buildRow($r, null, $headApproval, $financeApproval, $direkturApproval));
            } else {
                // One row per item
                foreach ($items as $item) {
                    $rows->push($this->buildRow($r, $item, $headApproval, $financeApproval, $direkturApproval));
                }
            }
        }

        return $rows;
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }

    /**
     * @param  mixed  $headApproval
     * @param  mixed  $financeApproval
     * @param  mixed  $direkturApproval
     */
    private function buildRow(
        Reimbursement $r,
        ?ReimbursementItem $item,
        $headApproval,
        $financeApproval,
        $direkturApproval
    ): array {
        return [
            $r->code,
            $r->atr?->code ?? '-',
            $r->user?->name ?? '-',
            $r->user?->nip ?? '-',
            $r->project?->code ?? '-',
            $r->project?->initial_project ?? '-',
            $r->project?->name ?? '-',
            $r->project?->division?->name ?? '-',
            $r->status?->value ?? '-',
            $r->eer_type ?? '-',
            $r->refund_reimburse_amount !== null ? (float) $r->refund_reimburse_amount : '-',
            (float) $r->amount,
            (float) ($r->transferred_amount ?? 0),
            $r->transfer_proof_path ? asset('storage/' . $r->transfer_proof_path) : '-',
            // Item
            $item?->item_name ?? '-',
            $item?->quantity ?? '-',
            $item instanceof ReimbursementItem ? (float) $item->unit_price : '-',
            $item instanceof ReimbursementItem ? (float) $item->amount : '-',
            $item?->expense_type?->value ?? '-',
            $item?->notes ?? '-',
            $item?->receipt_path ? asset('storage/' . $item->receipt_path) : '-',
            // Bank
            $r->bank_name ?? '-',
            $r->bank_account ?? '-',
            $r->account_holder ?? '-',
            $r->bank_branch ?? '-',
            $r->created_at?->format('Y-m-d H:i') ?? '-',
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
        ];
    }
}
