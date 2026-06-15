<?php

declare(strict_types=1);

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

final class ContractExpiringNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public readonly \App\Models\User $expiringUser
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        if (isset($notifiable->email) && str_ends_with($notifiable->email, '.test')) {
            return [];
        }

        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Kontrak Karyawan Akan Berakhir: '.$this->expiringUser->name)
            ->line('Pemberitahuan: Kontrak kerja untuk '.$this->expiringUser->name.' akan berakhir pada '.$this->expiringUser->contract_end.'.')
            ->action('Lihat Dashboard', url('/'))
            ->line('Mohon segera memproses pembaruan kontrak atau tindakan lainnya.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
