<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Actions\CreateReimbursement;
use App\Formatters\JsonResponseFormatter;
use App\Http\Requests\StoreReimbursementRequest;
use App\Http\Resources\V1\Reimbursement\ReimbursementResource;
use App\Services\ReimbursementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

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
        } catch (\Throwable $e) {
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
        } catch (\Throwable $e) {
            return JsonResponseFormatter::error($e->getMessage(), 500);
        }
    }

    public function show(string $code): JsonResponse
    {
        try {
            $data = $this->reimbursementService->getReimbursementDetail($code);

            if (!$data) {
                return JsonResponseFormatter::notFound('Reimbursement tidak ditemukan');
            }

            return JsonResponseFormatter::success(
                new ReimbursementResource($data),
                'Detail reimbursement berhasil diambil'
            );
        } catch (\Throwable $e) {
            return JsonResponseFormatter::error($e->getMessage(), 500);
        }
    }
}
