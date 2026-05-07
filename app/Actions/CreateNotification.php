<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Notification;
use App\Models\User;
use App\Notifications\SystemNotification;
use Illuminate\Support\Facades\Notification as NotificationFacade;

final readonly class CreateNotification
{
    /**
     * @param  array<int>  $recipientUserIds
     * @param  array<string, mixed>  $options
     */
    public function handle(
        string $type,
        string $title,
        string $message,
        array $recipientUserIds,
        ?string $referenceType = null,
        ?int $referenceId = null,
        ?int $createdBy = null,
        array $options = [],
    ): Notification {
        $notification = Notification::query()->create([
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'priority' => $options['priority'] ?? 'normal',
            'created_by' => $createdBy,
        ]);

        $uniqueIds = array_unique(array_filter($recipientUserIds));

        $users = User::query()->whereIn('id', $uniqueIds)->get();
        if ($users->isNotEmpty()) {
            NotificationFacade::send($users, new SystemNotification($title, $message));
        }

        foreach ($uniqueIds as $userId) {
            $notification->recipients()->create([
                'user_id' => $userId,
                'channel' => 'in_app',
                'status' => 'sent',
                'sent_at' => now(),
            ]);
        }

        return $notification;
    }

    /**
     * @param  array<string>  $roleNames
     * @return array<int>
     */
    public function getUserIdsByRoles(array $roleNames): array
    {
        /** @var array<int> $ids */
        $ids = User::query()->role($roleNames)->pluck('id')->all();

        return $ids;
    }
}
