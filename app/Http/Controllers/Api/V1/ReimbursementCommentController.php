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
    public function store(Request $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'comment' => ['required_without:image', 'nullable', 'string'],
                'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
            ]);

            $reimbursement = Reimbursement::query()->findOrFail($id);

            if ($reimbursement->user_id !== $request->user()->id && ! $request->user()->hasAnyRole(['head', 'finance', 'direktur', 'superadmin'])) {
                return JsonResponseFormatter::error('Unauthorized', 403);
            }

            $imagePath = null;
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $upload = resolve(\App\Services\FileUploadService::class)->uploadFile($file, 'reimbursement-comments', 'public');
                $imagePath = $upload['path'];
            }

            $comment = $reimbursement->comments()->create([
                'user_id' => $request->user()->id,
                'comment' => $validated['comment'] ?? '',
                'image_path' => $imagePath,
            ]);

            $approvers = $reimbursement->approvals()->pluck('approver_id')->toArray();
            $involvedIds = array_unique(array_merge([$reimbursement->user_id], $approvers));
            $recipientIds = array_diff($involvedIds, [$request->user()->id]);

            if (! empty($recipientIds)) {
                $notifier = new \App\Actions\CreateNotification();
                $notifier->handle(
                    type: 'reimbursement_comment',
                    title: 'Komentar Baru',
                    message: $request->user()->name.' menambahkan pesan baru pada pengajuan '.($reimbursement->code ?? 'Reimbursement').'.',
                    recipientUserIds: array_values($recipientIds),
                    referenceType: Reimbursement::class,
                    referenceId: $reimbursement->id,
                    createdBy: $request->user()->id,
                );
            }

            return JsonResponseFormatter::created(
                [
                    'id' => $comment->id,
                    'user_id' => $comment->user_id,
                    'user_name' => $comment->user->name,
                    'comment' => $comment->comment,
                    'image_path' => $comment->image_path,
                    'created_at' => $comment->created_at->toISOString(),
                ],
                'Komentar berhasil ditambahkan'
            );
        } catch (Throwable $e) {
            return JsonResponseFormatter::error($e->getMessage(), 500);
        }
    }
}
