<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Formatters\JsonResponseFormatter;
use App\Models\Reimbursement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Throwable;

final class ReimbursementCommentController extends Controller
{
    public function store(Request $request, string $code): JsonResponse
    {
        try {
            $validated = $request->validate([
                'comment' => ['required', 'string', 'min:3'],
            ]);

            $reimbursement = Reimbursement::where('code', $code)->firstOrFail();

            if ($reimbursement->user_id !== $request->user()->id && ! $request->user()->hasAnyRole(['head', 'finance', 'direktur', 'superadmin'])) {
                return JsonResponseFormatter::error('Unauthorized', 403);
            }

            $comment = $reimbursement->comments()->create([
                'user_id' => $request->user()->id,
                'comment' => $validated['comment'],
            ]);

            return JsonResponseFormatter::created(
                [
                    'id' => $comment->id,
                    'user_id' => $comment->user_id,
                    'user_name' => $comment->user->name,
                    'comment' => $comment->comment,
                    'created_at' => $comment->created_at->toISOString(),
                ],
                'Komentar berhasil ditambahkan'
            );
        } catch (Throwable $e) {
            return JsonResponseFormatter::error($e->getMessage(), 500);
        }
    }
}
