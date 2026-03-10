<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Actions\CreateLeave;
use App\Enums\ApprovalStatus;
use App\Enums\LeaveStatus;
use App\Http\Requests\StoreLeaveRequest;
use App\Http\Resources\V1\Leave\LeaveResource;
use App\Models\LeaveApproval;
use App\Services\LeaveService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Throwable;

final class LeaveController
{
    public function __construct(
        private readonly LeaveService $leaveService,
        private readonly CreateLeave $createLeave,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $leaves = $this->leaveService->listLeaves(
            user: $request->user(),
            filters: $request->only(['type', 'status', 'start_date', 'end_date', 'search', 'sort_by', 'sort_dir']),
            perPage: $request->integer('per_page', 15),
        );

        return LeaveResource::collection($leaves);
    }

    public function show(string $code): LeaveResource
    {
        $leave = $this->leaveService->findByCode($code);

        return new LeaveResource($leave);
    }

    public function store(StoreLeaveRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('attachment')) {
            $data['attachment'] = $request->file('attachment');
        }

        $leave = $this->createLeave->handle($data, $request->user()->id);

        return (new LeaveResource($leave))
            ->response()
            ->setStatusCode(201);
    }

    public function updateStatus(Request $request, string $code): JsonResponse
    {
        try {
            $validated = $request->validate([
                'action' => ['required', Rule::in(['approve', 'reject', 'revision'])],
                'notes' => ['nullable', 'string', 'max:1000'],
            ]);

            $leave = $this->leaveService->findByCode($code);
            $actor = $request->user();
            $isApprove = $validated['action'] === 'approve';
            $isRevision = $validated['action'] === 'revision';

            $requiredPermission = $isApprove || $isRevision ? 'approve_leaves' : 'reject_leaves';
            if (! $actor->can($requiredPermission)) {
                return response()->json(['message' => 'Anda tidak memiliki izin untuk melakukan aksi ini.'], 403);
            }

            if ($leave->user_id === $actor->id && ! $actor->can('approve_leaves')) {
                return response()->json(['message' => 'Anda tidak dapat menyetujui pengajuan milik sendiri.'], 403);
            }

            return DB::transaction(function () use ($leave, $actor, $validated, $isApprove): JsonResponse {
                $role = $actor->getRoleNames()->first();
                $submitterRole = $leave->user->getRoleNames()->first();

                // Find existing pending approval for this role
                $approval = LeaveApproval::where('leave_id', $leave->id)
                    ->where('role', $role)
                    ->first();

                $actionStatus = match ($validated['action']) {
                    'approve' => ApprovalStatus::Approved,
                    'reject' => ApprovalStatus::Rejected,
                    'revision' => ApprovalStatus::Revision,
                    default => ApprovalStatus::Pending,
                };

                if ($approval) {
                    $approval->update([
                        'status' => $actionStatus,
                        'notes' => $validated['notes'] ?? null,
                        'approved_at' => $isApprove ? now() : null,
                    ]);
                } else {
                    LeaveApproval::create([
                        'leave_id' => $leave->id,
                        'approver_id' => $actor->id,
                        'role' => $role,
                        'status' => $actionStatus,
                        'notes' => $validated['notes'] ?? null,
                        'approved_at' => $isApprove ? now() : null,
                    ]);
                }

                $newStatus = match (true) {
                    $validated['action'] === 'reject' => LeaveStatus::Rejected,
                    $validated['action'] === 'revision' => LeaveStatus::Revision ?? LeaveStatus::Rejected,
                    $submitterRole === 'head' => match (true) {
                        $role === 'hr' => LeaveStatus::HRApproved,
                        in_array($role, ['superadmin', 'direktur'], true) => LeaveStatus::SuperAdminApproved,
                        default => $leave->status,
                    },
                    default => match (true) {
                        $role === 'head' => LeaveStatus::HeadApproved,
                        $role === 'hr' => LeaveStatus::HRApproved,
                        in_array($role, ['superadmin', 'direktur'], true) => LeaveStatus::SuperAdminApproved,
                        default => $leave->status,
                    },
                };

                $leave->update(['status' => $newStatus]);
                $leave->load(['user', 'project', 'replacementPic', 'approvals.approver']);

                return (new LeaveResource($leave))->response()->setStatusCode(200);
            });
        } catch (Throwable $th) {
            return response()->json(['err' => $th->getMessage()], 500);
        }
    }

    public function update(
        UpdateLeaveRequest $request,
        string $code,
        \App\Actions\CreateNotification $createNotification
    ): JsonResponse {
        try {
            $leave = $this->leaveService->findByCode($code);
            $data = $request->validated();

            return DB::transaction(function () use ($leave, $data, $request): JsonResponse {
                if ($request->hasFile('attachment')) {
                    $data['attachment_path'] = app(\App\Services\FileUploadService::class)->uploadFile(
                        $request->file('attachment'),
                        "leaves/{$request->user()->id}/attachments"
                    )['path'];
                }

                $leave->update([
                    'project_id' => $data['project_id'] ?? $leave->project_id,
                    'replacement_pic_id' => $data['replacement_pic_id'] ?? $leave->replacement_pic_id,
                    'phone' => $data['phone'] ?? $leave->phone,
                    'destination' => $data['destination'] ?? $leave->destination,
                    'lokasi' => $data['lokasi'] ?? $leave->lokasi,
                    'type' => $data['type'] ?? $leave->type,
                    'status' => LeaveStatus::Revised,
                    'start_date' => $data['start_date'] ?? $leave->start_date,
                    'end_date' => $data['end_date'] ?? $leave->end_date,
                    'reason' => $data['reason'] ?? $leave->reason,
                    'attachment_path' => $data['attachment_path'] ?? $leave->attachment_path,
                ]);

                // Reset all approvals to pending
                $leave->approvals()->update([
                    'status' => ApprovalStatus::Pending,
                    'notes' => null,
                    'approved_at' => null,
                ]);

                // Notify HR roles
                $hrUserIds = $createNotification->getUserIdsByRoles(['hr']);
                if (! empty($hrUserIds)) {
                    $createNotification->handle(
                        type: 'leave_revised',
                        title: 'Pengajuan Cuti Direvisi',
                        message: "Pengajuan cuti {$leave->code} telah diperbaiki oleh {$leave->user->name}.",
                        recipientUserIds: $hrUserIds,
                        referenceType: 'leave',
                        referenceId: $leave->id,
                        createdBy: $request->user()->id
                    );
                }

                return (new LeaveResource($leave->load(['user', 'project', 'replacementPic', 'approvals.approver'])))
                    ->response()
                    ->setStatusCode(200);
            });
        } catch (Throwable $th) {
            return response()->json(['err' => $th->getMessage()], 500);
        }
    }

    public function destroy(Request $request, string $code): JsonResponse
    {
        try {
            $user = $request->user();
            if (! $user->hasAnyRole(['hr', 'superadmin'])) {
                return response()->json(['message' => 'Hanya HR dan Superadmin yang dapat menghapus data cuti.'], 403);
            }

            $leave = $this->leaveService->findByCode($code);
            $leave->delete();

            return response()->json(['message' => 'Data cuti berhasil dihapus.'], 200);
        } catch (Throwable $th) {
            return response()->json(['err' => $th->getMessage()], 500);
        }
    }
}
