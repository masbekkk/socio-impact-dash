<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Actions\CreateReimbursement;
use App\Actions\UpdateReimbursementStatus;
use App\Formatters\JsonResponseFormatter;
use App\Http\Requests\StoreReimbursementRequest;
use App\Http\Requests\UpdateReimbursementStatusRequest;
use App\Http\Resources\V1\Reimbursement\ReimbursementResource;
use App\Models\Project;
use App\Models\Reimbursement;
use App\Models\User;
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
                'division_id' => $request->get('division_id'),
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

    public function exportExcel(Request $request): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $user = $request->user();
        $filters = [
            'status' => $request->get('status'),
            'project_id' => $request->get('project_id'),
            'start_date' => $request->get('start_date'),
            'end_date' => $request->get('end_date'),
            'division_id' => $request->get('division_id'),
        ];

        $filename = 'export-reimbursement-'.now()->format('Y-m-d').'.xlsx';

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\ReimbursementExport($user, $filters),
            $filename
        );
    }

    public function store(StoreReimbursementRequest $request, CreateReimbursement $createReimbursement): JsonResponse
    {
        try {
            $user = $request->user();

            $reimbursement = $createReimbursement->handle(
                $request->all(),
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

    public function show(string $code, Request $request): JsonResponse
    {
        try {
            $data = $this->reimbursementService->getReimbursementDetail($code);

            if (! $data) {
                return JsonResponseFormatter::notFound('Reimbursement tidak ditemukan');
            }

            $user = $request->user();

            if (! $user->hasAnyPermission(['approve_reimbursements', 'reject_reimbursements']) && $data->user_id !== $user->id) {
                return JsonResponseFormatter::error('Anda tidak memiliki akses ke data ini', 403);
            }

            // Provide projects and users for the revision editor dropdowns
            $projects = Project::select('id', 'name', 'code', 'operational_budget', 'allowance_budget', 'division_id', 'pic_id')
                ->with(['division:id,name', 'pic:id,name'])
                ->get()
                ->map(fn ($project) => [
                    'id' => $project->id,
                    'name' => $project->name,
                    'code' => $project->code,
                    'operational_budget' => $project->operational_budget,
                    'allowance_budget' => $project->allowance_budget,
                    'division_name' => $project->division?->name ?? 'Tidak ada divisi',
                    'pic_name' => $project->pic?->name ?? 'Belum ada PIC',
                ]);

            $users = User::select('id', 'name')->get();

            return response()->json([
                'success' => true,
                'data' => new ReimbursementResource($data),
                'projects' => $projects,
                'users' => $users,
            ]);
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
                'items' => ['nullable', 'array'],
                'selected_budget_details' => ['nullable', 'array'],
                'eer_type' => ['nullable', 'string', 'in:refund,reimbursement'],
                'refund_reimburse_amount' => ['nullable', 'numeric', 'min:0'],
                'project_id' => ['nullable', 'integer', 'exists:projects,id'],
                'replacement_pic_id' => ['nullable', 'integer', 'exists:users,id'],
                'urgency' => ['nullable', 'string', 'max:20'],
            ]);

            \Illuminate\Support\Facades\DB::transaction(function () use ($reimbursement, $validated, $user) {
                // Update editable fields
                $updateData = ['status' => \App\Enums\ReimbursementStatus::Submitted];
                if (isset($validated['usage_plan'])) {
                    $updateData['usage_plan'] = $validated['usage_plan'];
                }
                if (isset($validated['start_date'])) {
                    $updateData['start_date'] = $validated['start_date'];
                }
                if (isset($validated['end_date'])) {
                    $updateData['end_date'] = $validated['end_date'];
                }
                if (isset($validated['eer_type'])) {
                    $updateData['eer_type'] = $validated['eer_type'];
                }
                if (isset($validated['refund_reimburse_amount'])) {
                    $updateData['refund_reimburse_amount'] = $validated['refund_reimburse_amount'];
                }
                if (array_key_exists('project_id', $validated)) {
                    $updateData['project_id'] = $validated['project_id'];
                }
                if (array_key_exists('replacement_pic_id', $validated)) {
                    $updateData['replacement_pic_id'] = $validated['replacement_pic_id'];
                }
                if (array_key_exists('urgency', $validated)) {
                    $updateData['urgency'] = $validated['urgency'];
                }

                // Sync items if provided
                if (isset($validated['items'])) {
                    $reimbursement->items()->delete();
                    foreach ($validated['items'] as $item) {
                        $reimbursement->items()->create([
                            'project_budget_detail_id' => $item['project_budget_detail_id'],
                            'parent_item_id' => $item['parent_item_id'] ?? null,
                            'item_name' => $item['item_name'],
                            'quantity' => $item['quantity'] ?? 1,
                            'unit_price' => $item['unit_price'] ?? 0,
                            'amount' => $item['amount'] ?? 0,
                            'expense_type' => $item['expense_type'] ?? null,
                            'notes' => $item['notes'] ?? null,
                        ]);
                    }
                }

                // Sync budget details if provided
                if (isset($validated['selected_budget_details'])) {
                    $reimbursement->atrBudgetSelecteds()->delete();
                    foreach ($validated['selected_budget_details'] as $budget) {
                        $reimbursement->atrBudgetSelecteds()->create([
                            'project_budget_detail_id' => $budget['project_budget_detail_id'],
                            'amount' => $budget['amount'],
                            'notes' => $budget['notes'] ?? null,
                        ]);
                    }
                }

                // Recalculate amount if items or budget details were synced
                if (isset($validated['items']) || isset($validated['selected_budget_details'])) {
                    $newAmount = 0;
                    if ($reimbursement->type->value === 'atr') {
                        $newAmount = $reimbursement->atrBudgetSelecteds()->sum('amount');
                    } else {
                        $newAmount = $reimbursement->items()->sum('amount');
                    }
                    $updateData['amount'] = $newAmount;
                } elseif (isset($validated['amount'])) {
                    $updateData['amount'] = $validated['amount'];
                }

                $reimbursement->update($updateData);

                $reimbursement->update([
                    'status' => \App\Enums\ReimbursementStatus::Revised,
                ]);

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
