<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Formatters\JsonResponseFormatter;
use App\Models\NotificationRecipient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

final class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $notifications = NotificationRecipient::with('notification.creator')
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 15));

        $data = $notifications->through(function (NotificationRecipient $nr) {
            $n = $nr->notification;

            return [
                'id' => $nr->id,
                'notification_id' => $n->id,
                'type' => $n->type,
                'title' => $n->title,
                'message' => $n->message,
                'reference_type' => $n->reference_type,
                'reference_id' => $n->reference_id,
                'priority' => $n->priority,
                'status' => $nr->status,
                'read_at' => $nr->read_at?->toISOString(),
                'created_at' => $n->created_at->toISOString(),
                'creator' => $n->creator ? [
                    'id' => $n->creator->id,
                    'name' => $n->creator->name,
                ] : null,
            ];
        });

        return JsonResponseFormatter::success($data, 'Notifications retrieved');
    }

    public function unreadCount(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $count = NotificationRecipient::where('user_id', $user->id)
            ->whereNull('read_at')
            ->count();

        return JsonResponseFormatter::success(['count' => $count], 'Unread count');
    }

    public function markAsRead(Request $request, int $id): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $recipient = NotificationRecipient::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $recipient->update([
            'read_at' => now(),
            'status' => 'read',
        ]);

        return JsonResponseFormatter::success(null, 'Notification marked as read');
    }

    public function markAllRead(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        NotificationRecipient::where('user_id', $user->id)
            ->whereNull('read_at')
            ->update([
                'read_at' => now(),
                'status' => 'read',
            ]);

        return JsonResponseFormatter::success(null, 'All notifications marked as read');
    }
}
