<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Formatters\JsonResponseFormatter;
use App\Http\Requests\CheckInRequest;
use App\Http\Requests\CheckOutRequest;
use App\Http\Requests\SubmitPermissionRequest;
use App\Http\Resources\PresenceResource;
use App\Services\PresenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PresenceController
{
    public function __construct(
        private PresenceService $presenceService
    ) {}

    public function checkIn(CheckInRequest $request): JsonResponse
    {
        try {
            $presence = $this->presenceService->checkIn(
                $request->user(),
                $request->validated()
            );

            return JsonResponseFormatter::created(
                new PresenceResource($presence),
                'Check-in berhasil.'
            );
        } catch (\Exception $e) {
            return JsonResponseFormatter::error($e->getMessage());
        }
    }

    public function checkOut(CheckOutRequest $request): JsonResponse
    {
        try {
            $presence = $this->presenceService->checkOut(
                $request->user(),
                $request->validated()
            );

            return JsonResponseFormatter::success(
                new PresenceResource($presence),
                'Check-out berhasil.'
            );
        } catch (\Exception $e) {
            return JsonResponseFormatter::error($e->getMessage());
        }
    }

    public function submitPermission(SubmitPermissionRequest $request): JsonResponse
    {
        try {
            $presence = $this->presenceService->submitPermission(
                $request->user(),
                $request->validated()
            );

            return JsonResponseFormatter::created(
                new PresenceResource($presence),
                'Pengajuan berhasil disimpan.'
            );
        } catch (\Exception $e) {
            return JsonResponseFormatter::error($e->getMessage());
        }
    }

    public function today(Request $request): JsonResponse
    {
        $presence = $this->presenceService->getTodayPresence($request->user());

        return JsonResponseFormatter::success(
            $presence ? new PresenceResource($presence) : null
        );
    }

    public function history(Request $request): JsonResponse
    {
        $filters = [
            'start_date' => $request->get('start_date'),
            'end_date' => $request->get('end_date'),
            'status' => $request->get('status'),
            'month' => $request->get('month'),
            'year' => $request->get('year'),
        ];

        $perPage = (int) $request->get('per_page', 15);
        $presences = $this->presenceService->getPresenceHistory(
            $request->user(),
            $filters,
            $perPage
        );

        return JsonResponseFormatter::success(
            PresenceResource::collection($presences), 'Riwayat absen ditampilkan'
        );
    }

    public function monthlySummary(Request $request): JsonResponse
    {
        $month = (int) $request->get('month', now()->month);
        $year = (int) $request->get('year', now()->year);

        $summary = $this->presenceService->getMonthlySummary(
            $request->user(),
            $month,
            $year
        );

        return JsonResponseFormatter::success($summary);
    }
}
