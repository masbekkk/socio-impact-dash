<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\UserRole;
use App\Models\User;
use App\Notifications\ContractExpiringNotification;
use Illuminate\Console\Command;

final class NotifyHrContractExpiring extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:notify-expiring-contracts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Notify HR 1 month before any users contract expires';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $targetDate = now()->addMonth()->toDateString();

        $expiringUsers = User::whereDate('contract_end', $targetDate)->get();

        if ($expiringUsers->isEmpty()) {
            $this->info('No contracts expiring exactly 1 month from today.');

            return;
        }

        $hrUsers = User::role(UserRole::HR->value)->get();

        if ($hrUsers->isEmpty()) {
            $this->warn('Contracts are expiring, but no users with the HR role were found.');

            return;
        }

        foreach ($expiringUsers as $expiringUser) {
            foreach ($hrUsers as $hrUser) {
                $hrUser->notify(new ContractExpiringNotification($expiringUser));
            }
            $this->info("Notified HR for user: {$expiringUser->name}");
        }

        $this->info('Done sending contract expiry notifications.');
    }
}
