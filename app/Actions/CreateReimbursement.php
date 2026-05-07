<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\ReimbursementStatus;
use App\Models\Reimbursement;
use App\Services\FileUploadService;
use BackedEnum;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

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

            if ($reimbursement->status !== ReimbursementStatus::Draft) {
                $this->assignApprovers($reimbursement, $data);
                $this->notifyApprovers($reimbursement);
            }

            return $reimbursement->load(['documents', 'atrBudgetSelecteds.budgetDetail', 'approvals.approver', 'items.budgetDetail']);
        });
    }

    public function assignApprovers(Reimbursement $reimbursement, array $data): void
    {
        $roles = [
            'head' => $data['approver_head_id'] ?? null,
            'hr' => $data['approver_hr_id'] ?? null,
            'finance' => $data['approver_finance_id'] ?? null,
            'direktur' => $data['approver_direktur_id'] ?? null,
        ];

        // Fallback for Head: if not provided, try project PIC or then Project Head
        if (empty($roles['head']) && $reimbursement->project) {
            $roles['head'] = $reimbursement->project->pic_id ?? $reimbursement->project->head_id;
        }

        // Ensure Allowance skips finance and direktur even if passed in data
        if ($reimbursement->type->value === 'allowance') {
            $roles['finance'] = null;
        }

        // Default approvers if not provided
        if (empty($roles['finance']) && $reimbursement->type->value !== 'allowance') {
            $roles['finance'] = \App\Models\User::query()->where('email', 'finance@socio-impact.test')->first()?->id;
        }

        if (empty($roles['hr']) && $reimbursement->type->value === 'allowance') {
            $roles['hr'] = \App\Models\User::query()->where('email', 'hr@socio-impact.test')->first()?->id;
        }

        if (empty($roles['direktur'])) {
            $roles['direktur'] = \App\Models\User::query()->where('email', 'direktur@socio-impact.test')->first()?->id;
        }

        // If Head and HR are the same person, skip the HR step (prioritize Head)
        if ($roles['head'] && $roles['hr'] && (int) $roles['head'] === (int) $roles['hr']) {
            $roles['hr'] = null;
        }

        // Additional Logic: If submitter has both Head and HR roles, skip HR for EER (consistent with ATR behavior)
        if ($reimbursement->type->value === 'eer') {
            $submitter = \App\Models\User::find($reimbursement->user_id);
            if ($submitter && $submitter->hasRole('head') && $submitter->hasRole('hr')) {
                $roles['hr'] = null;
            }
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

    private function createReimbursementRecord(array $data, int $userId): Reimbursement
    {
        return Reimbursement::query()->create([
            'code' => $data['code'] ?? null,
            'user_id' => $data['user_id'] ?? $userId,
            'project_id' => $data['project_id'] ?? null,
            'atr_id' => $data['atr_id'] ?? null,
            'type' => $data['type'],
            'eer_type' => $data['eer_type'] ?? null,
            'status' => $data['status'] ?? ReimbursementStatus::Submitted,
            'amount' => $data['amount'] ?? null,
            'bank_name' => $data['bank_name'] ?? null,
            'bank_account' => $data['bank_account'] ?? null,
            'account_holder' => $data['account_holder'] ?? null,
            'usage_plan' => $data['usage_plan'] ?? null,
            'urgency' => $data['urgency'] ?? null,
            'start_date' => $data['start_date'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'start_time' => $data['start_time'] ?? null,
            'end_time' => $data['end_time'] ?? null,
            'replacement_pic_id' => $data['replacement_pic_id'] ?? null,
            'transfer_proof_path' => isset($data['transfer_proof']) && $data['transfer_proof'] instanceof UploadedFile
                ? $data['transfer_proof']->store('reimbursements/transfer-proofs', 'public')
                : null,
            'transferred_at' => isset($data['transfer_proof']) && $data['transfer_proof'] instanceof UploadedFile
                ? now()
                : null,
        ]);
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

    private function notifyApprovers(Reimbursement $reimbursement): void
    {
        /** @var array<int> $approverIds */
        $approverIds = $reimbursement->approvals()->pluck('approver_id')->filter()->unique()->toArray();

        if (empty($approverIds)) {
            return;
        }

        /** @var BackedEnum|string $type */
        $type = $reimbursement->type;
        $typeString = $type instanceof BackedEnum ? (string) $type->value : (string) $type;
        /** @var \App\Models\Project|null $project */
        $project = $reimbursement->project;
        $projectName = $project ? $project->name : 'Non-Project';
        $amount = 'Rp '.number_format((float) $reimbursement->amount, 0, ',', '.');
        $code = $reimbursement->code ?? 'Draft';

        $notifier = new CreateNotification();
        $notifier->handle(
            type: 'reimbursement_created',
            title: 'Pengajuan Reimbursement Baru',
            message: 'Pengajuan '.mb_strtoupper($typeString)." ({$code}) untuk proyek '{$projectName}' senilai {$amount} telah dibuat dan membutuhkan persetujuan Anda.",
            recipientUserIds: $approverIds,
            referenceType: Reimbursement::class,
            referenceId: $reimbursement->id,
            createdBy: $reimbursement->user_id,
        );
    }
}
