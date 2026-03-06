<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\ReimbursementStatus;
use App\Models\Reimbursement;
use App\Services\FileUploadService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final readonly class CreateReimbursement
{
    public function __construct(private FileUploadService $fileUploadService) {}

    public function handle(array $data, int $userId): Reimbursement
    {
        return DB::transaction(function () use ($data, $userId) {
            $reimbursement = $this->createReimbursementRecord($data, $userId);

            if (! empty($data['documents'])) {
                $this->syncDocuments($reimbursement, $data['documents'], $userId);
            }

            if (! empty($data['selected_budget_details'])) {
                $this->syncSelectedBudgets($reimbursement, $data['selected_budget_details']);
            }

            if (! empty($data['items'])) {
                $this->syncReimbursementItems($reimbursement, $data['items']);
            }

            $this->assignApprovers($reimbursement, $data);

            return $reimbursement->load(['documents', 'atrBudgetSelecteds.budgetDetail', 'approvals.approver', 'items.budgetDetail']);
        });
    }

    private function createReimbursementRecord(array $data, int $userId): Reimbursement
    {
        return Reimbursement::create([
            'code' => $this->generateUniqueCode(),
            'user_id' => $userId,
            'project_id' => $data['project_id'] ?? null,
            'atr_id' => $data['atr_id'] ?? null,
            'type' => $data['type'],
            'eer_type' => $data['eer_type'] ?? null,
            'status' => ReimbursementStatus::Submitted,
            'amount' => $data['amount'] ?? null,
            'bank_name' => $data['bank_name'] ?? null,
            'bank_account' => $data['bank_account'] ?? null,
            'account_holder' => $data['account_holder'] ?? null,
            'usage_plan' => $data['usage_plan'] ?? null,
            'urgency' => $data['urgency'] ?? null,
            'start_date' => $data['start_date'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'replacement_pic_id' => $data['replacement_pic_id'] ?? null,
        ]);
    }

    private function generateUniqueCode(): string
    {
        do {
            $code = 'RMB-'.mb_strtoupper(Str::random(6));
        } while (Reimbursement::where('code', $code)->exists());

        return $code;
    }

    private function syncDocuments(Reimbursement $reimbursement, array $documents, int $userId): void
    {
        foreach ($documents as $doc) {
            if (isset($doc['file']) && $doc['file'] instanceof UploadedFile) {
                $meta = $this->fileUploadService->uploadFile(
                    $doc['file'],
                    "reimbursements/{$reimbursement->id}/documents"
                );

                $reimbursement->documents()->create([
                    'type' => $doc['type'] ?? 'other',
                    'original_name' => $meta['original_name'],
                    'path' => $meta['path'],
                    'mime' => $meta['mime'],
                    'size' => $meta['size'],
                    'uploaded_by' => $userId,
                ]);
            }
        }
    }

    private function syncSelectedBudgets(Reimbursement $reimbursement, array $budgets): void
    {
        foreach ($budgets as $budget) {
            $reimbursement->atrBudgetSelecteds()->create([
                'project_budget_detail_id' => $budget['project_budget_detail_id'],
                'amount' => $budget['amount'],
                'notes' => $budget['notes'] ?? null,
            ]);
        }
    }

    private function syncReimbursementItems(Reimbursement $reimbursement, array $items): void
    {
        foreach ($items as $item) {
            $receiptPath = null;
            if (isset($item['receipt']) && $item['receipt'] instanceof UploadedFile) {
                $meta = $this->fileUploadService->uploadFile(
                    $item['receipt'],
                    "reimbursements/{$reimbursement->id}/receipts"
                );
                $receiptPath = $meta['path'];
            }

            $reimbursement->items()->create([
                'project_budget_detail_id' => $item['project_budget_detail_id'],
                'parent_item_id' => $item['parent_item_id'] ?? null,
                'item_name' => $item['item_name'],
                'quantity' => $item['quantity'] ?? 1,
                'unit_price' => $item['unit_price'] ?? 0,
                'amount' => $item['amount'] ?? 0,
                'expense_type' => $item['expense_type'] ?? null,
                'receipt_path' => $receiptPath,
                'notes' => $item['notes'] ?? null,
            ]);
        }
    }

    private function assignApprovers(Reimbursement $reimbursement, array $data): void
    {
        $roles = [
            'head' => $data['approver_head_id'] ?? null,
            'finance' => $data['approver_finance_id'] ?? null,
            'direktur' => $data['approver_direktur_id'] ?? null,
            'hr' => $data['approver_hr_id'] ?? null,
        ];

        // Default approvers if not provided
        if (empty($roles['finance'])) {
            $roles['finance'] = \App\Models\User::where('email', 'finance@socio-impact.test')->first()?->id;
        }

        if (empty($roles['hr'])) {
            $roles['hr'] = \App\Models\User::where('email', 'hr@socio-impact.test')->first()?->id;
        }

        if (empty($roles['direktur'])) {
            $roles['direktur'] = \App\Models\User::where('email', 'direktur@socio-impact.test')->first()?->id;
        }

        foreach ($roles as $role => $approverId) {
            if ($approverId) {
                $reimbursement->approvals()->create([
                    'approver_id' => $approverId,
                    'role' => $role,
                    'status' => \App\Enums\ApprovalStatus::Pending->value,
                ]);
            }
        }
    }
}
