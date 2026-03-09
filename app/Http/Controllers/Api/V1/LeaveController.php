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

            if ($leave->user_id === $actor->id) {
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
                    'revision' => 'revision', // Using string loosely if defined
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

}
