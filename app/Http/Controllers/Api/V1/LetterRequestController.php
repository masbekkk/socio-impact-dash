<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\UserRole;
use App\Formatters\JsonResponseFormatter;
use App\Models\LetterRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

final class LetterRequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = LetterRequest::with(['project', 'requester']);

        // Finance and Superadmin can see all
        if (! $user->hasRole([UserRole::Finance, UserRole::Superadmin])) {
            $query->where('requester_id', $user->id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                    ->orWhere('recipient', 'like', "%{$search}%")
                    ->orWhereHas('project', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('code', 'like', "%{$search}%");
                    });
            });
        }

        $letterRequests = $query->latest()->paginate($request->integer('per_page', 10));

        return JsonResponseFormatter::success(
            $letterRequests,
            'Letter requests retrieved successfully'
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'letter_date' => 'required|date',
            'recipient' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'pic_name' => 'required|string|max:255',
        ]);

        $letterRequest = LetterRequest::create([
            ...$validated,
            'requester_id' => $request->user()->id,
            'status' => 'pending',
        ]);

        return JsonResponseFormatter::success(
            $letterRequest,
            'Letter request created successfully',
            201
        );
    }

    public function assignNumber(Request $request, LetterRequest $letterRequest): JsonResponse
    {
        $user = $request->user();
        if (! $user->hasRole([UserRole::Finance, UserRole::Superadmin])) {
            return JsonResponseFormatter::error('Unauthorized', 403);
        }

        $validated = $request->validate([
            'letter_number' => 'required|string|max:255',
        ]);

        $letterRequest->update([
            'letter_number' => $validated['letter_number'],
            'status' => 'assigned',
        ]);

        return JsonResponseFormatter::success(
            $letterRequest,
            'Letter number assigned successfully'
        );
    }

    public function reject(Request $request, LetterRequest $letterRequest): JsonResponse
    {
        $user = $request->user();
        if (! $user->hasRole([UserRole::Finance, UserRole::Superadmin])) {
            return JsonResponseFormatter::error('Unauthorized', 403);
        }

        $letterRequest->update([
            'status' => 'rejected',
        ]);

        return JsonResponseFormatter::success(
            $letterRequest,
            'Letter request rejected successfully'
        );
    }
}
