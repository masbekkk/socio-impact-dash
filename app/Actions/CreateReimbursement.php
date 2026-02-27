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

            if (!empty($data['documents'])) {
                $this->syncDocuments($reimbursement, $data['documents'], $userId);
            }

            if (!empty($data['selected_budget_details'])) {
                $this->syncSelectedBudgets($reimbursement, $data['selected_budget_details']);
            }

            return $reimbursement->load(['documents', 'atrBudgetSelecteds.budgetDetail']);
        });
    }

    private function createReimbursementRecord(array $data, int $userId): Reimbursement
    {
        return Reimbursement::create([
            'code' => $this->generateUniqueCode(),
            'user_id' => $userId,
            'project_id' => $data['project_id'] ?? null,
            'type' => $data['type'],
            'eer_type' => $data['eer_type'] ?? null,
            'status' => ReimbursementStatus::Submitted,
            'amount' => $data['amount'] ?? null,
            'bank_name' => $data['bank_name'] ?? null,
            'bank_account' => $data['bank_account'] ?? null,
            'account_holder' => $data['account_holder'] ?? null,
            'usage_plan' => $data['usage_plan'] ?? null,
            'urgency' => $data['urgency'] ?? null,
        ]);
    }

    private function generateUniqueCode(): string
    {
        do {
            $code = 'RMB-' . mb_strtoupper(Str::random(6));
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
            ]);
        }
    }
}
