<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Actions\CreateReimbursement;
use App\Actions\UpdateReimbursementStatus;
use App\Formatters\JsonResponseFormatter;
use App\Http\Requests\StoreReimbursementRequest;
use App\Http\Requests\UpdateReimbursementStatusRequest;
use App\Http\Resources\V1\Reimbursement\ReimbursementResource;
use App\Models\Reimbursement;
use App\Services\ReimbursementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Throwable;

final class ReimbursementController extends Controller
{
    public function __construct(
        private ReimbursementService $reimbursementService
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            $filters = [
                'status' => $request->get('status'),
                'type' => $request->get('type'),
                'project_id' => $request->get('project_id'),
                'start_date' => $request->get('start_date'),
                'end_date' => $request->get('end_date'),
            ];

            $perPage = $request->integer('per_page', 15);
            $reimbursements = $this->reimbursementService->listReimbursements($user, $filters, $perPage);

            return JsonResponseFormatter::success(
                ReimbursementResource::collection($reimbursements),
                'Daftar reimbursement berhasil diambil'
            );
        } catch (Throwable $e) {
            return JsonResponseFormatter::error($e->getMessage(), 500);
        }
    }

    public function store(StoreReimbursementRequest $request, CreateReimbursement $createReimbursement): JsonResponse
    {
        try {
            $user = $request->user();

            $reimbursement = $createReimbursement->handle(
                $request->validated(),
                $user->id
            );

            return JsonResponseFormatter::created(
                new ReimbursementResource($reimbursement),
                'Reimbursement berhasil dibuat'
            );
        } catch (Throwable $e) {
            return JsonResponseFormatter::error($e->getMessage(), 500);
        }
    }

    public function show(string $code): JsonResponse
    {
        try {
            $data = $this->reimbursementService->getReimbursementDetail($code);
            if (! $data) {
                return JsonResponseFormatter::notFound('Reimbursement tidak ditemukan');
            }

            return JsonResponseFormatter::success(
                new ReimbursementResource($data),
                'Detail reimbursement berhasil diambil'
            );
        } catch (Throwable $e) {
            return JsonResponseFormatter::error($e->getMessage(), 500);
        }
    }

    public function updateStatus(
        string $code,
        UpdateReimbursementStatusRequest $request,
        UpdateReimbursementStatus $action
    ): JsonResponse {
        try {
            $reimbursement = Reimbursement::where('code', $code)->first();

            if (! $reimbursement) {
                return JsonResponseFormatter::notFound('Reimbursement tidak ditemukan');
            }

            $result = $action->handle(
                $reimbursement,
                $request->validated(),
                $request->user()->id,
                $request->file('transfer_proof')
            );

            $actionLabel = $request->validated('action') === 'approved' ? 'disetujui' : 'ditolak';

            return JsonResponseFormatter::success(
                new ReimbursementResource($result),
                "Reimbursement berhasil {$actionLabel}"
            );
        } catch (Throwable $e) {
            return JsonResponseFormatter::error($e->getMessage(), 500);
        }
    }

    public function updateBudgets(string $code, Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            if (! $user->hasPermissionTo('edit_atr_budget') && ! $user->hasRole('superadmin')) {
                return JsonResponseFormatter::error('Unauthorized', 403);
            }

            $validated = $request->validate([
                'budgets' => 'required|array',
                'budgets.*.id' => 'required|integer',
                'budgets.*.amount' => 'required|numeric|min:0',
            ]);

            $reimbursement = Reimbursement::where('code', $code)->first();

            if (! $reimbursement) {
                return JsonResponseFormatter::notFound('Reimbursement tidak ditemukan');
            }

            \Illuminate\Support\Facades\DB::transaction(function () use ($reimbursement, $validated) {
                $totalAmount = 0;
                foreach ($validated['budgets'] as $budgetData) {
                    $record = \App\Models\AtrBudgetSelected::where('reimbursement_id', $reimbursement->id)
                        ->where('id', $budgetData['id'])
                        ->first();

                    if ($record) {
                        $record->update(['amount' => $budgetData['amount']]);
                        $totalAmount += $budgetData['amount'];
                    }
                }

                // Also need to sum any unmodified ones just in case? Or actually just sum all belonging to this ATR.
                $actualTotal = \App\Models\AtrBudgetSelected::where('reimbursement_id', $reimbursement->id)->sum('amount');
                $reimbursement->update(['amount' => $actualTotal]);
            });

            // Reload data
            $data = $this->reimbursementService->getReimbursementDetail($code);

            return JsonResponseFormatter::success(
                new ReimbursementResource($data),
                'Budget reimbursement berhasil diupdate'
            );
        } catch (Throwable $e) {
            return JsonResponseFormatter::error($e->getMessage(), 500);
        }
    }

    public function resubmit(string $code, Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $reimbursement = Reimbursement::where('code', $code)->first();

            if (! $reimbursement) {
                return JsonResponseFormatter::notFound('Reimbursement tidak ditemukan');
            }

            if ($reimbursement->user_id !== $user->id) {
                return JsonResponseFormatter::error('Hanya pembuat pengajuan yang dapat mengirim ulang revisi.', 403);
            }

            if ($reimbursement->status->value !== 'revision') {
                return JsonResponseFormatter::error('Pengajuan tidak dalam status revisi.', 422);
            }

            $validated = $request->validate([
                'usage_plan' => ['nullable', 'string'],
                'amount' => ['nullable', 'numeric', 'min:0'],
                'start_date' => ['nullable', 'date'],
                'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
                'revision_note' => ['nullable', 'string'],
            ]);

            \Illuminate\Support\Facades\DB::transaction(function () use ($reimbursement, $validated, $user) {
                // Update editable fields
                $updateData = ['status' => \App\Enums\ReimbursementStatus::Submitted];
                if (isset($validated['usage_plan'])) $updateData['usage_plan'] = $validated['usage_plan'];
                if (isset($validated['amount'])) $updateData['amount'] = $validated['amount'];
                if (isset($validated['start_date'])) $updateData['start_date'] = $validated['start_date'];
                if (isset($validated['end_date'])) $updateData['end_date'] = $validated['end_date'];

                $reimbursement->update($updateData);

                // Reset all approvals back to pending
                $reimbursement->approvals()->update([
                    'status' => 'pending',
                    'approved_at' => null,
                ]);

                // Add a system comment notifying approvers
                $note = $validated['revision_note'] ?? 'Pengajuan telah direvisi dan diajukan kembali.';
                $reimbursement->comments()->create([
                    'user_id' => $user->id,
                    'comment' => "[Revisi Diajukan Ulang] {$note}",
                ]);
            });

            $data = $this->reimbursementService->getReimbursementDetail($code);

            return JsonResponseFormatter::success(
                new ReimbursementResource($data),
                'Revisi berhasil diajukan kembali'
            );
        } catch (Throwable $e) {
            return JsonResponseFormatter::error($e->getMessage(), 500);
        }
    }

    public function destroy(string $id, Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            if (! $user->hasRole('superadmin')) {
                return JsonResponseFormatter::error('Unauthorized', 403);
            }

            $reimbursement = Reimbursement::where('id', $id)->orWhere('code', $id)->first();
            if (! $reimbursement) {
                return JsonResponseFormatter::notFound('Reimbursement tidak ditemukan');
            }

            // Optional: delete related records if they don't have cascade delete
            $reimbursement->delete();

            return JsonResponseFormatter::success(null, 'Reimbursement berhasil dihapus');
        } catch (Throwable $e) {
            return JsonResponseFormatter::error($e->getMessage(), 500);
        }
    }
}
