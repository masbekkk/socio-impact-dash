<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Reimbursement;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FixBuggyAtrs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix:buggy-atrs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix duplicated item amounts in transferred ATRs caused by UpdateReimbursementStatus bug';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $this->info('Scanning for buggy ATRs...');

        $reimbs = Reimbursement::query()
            ->where('type', 'atr')
            ->where('status', 'transferred')
            ->with(['items', 'atrBudgetSelecteds'])
            ->get();

        $buggyReimbs = [];

        foreach ($reimbs as $r) {
            $sumItems = $r->items->sum('amount');
            // If the sum of items is greater than the total amount, it's a buggy ATR.
            if ($sumItems > (float) $r->amount + 1) {
                $buggyReimbs[] = $r;
            }
        }

        if (count($buggyReimbs) === 0) {
            $this->info('No buggy ATRs found. Database is clean.');
            return;
        }

        $this->warn('Found ' . count($buggyReimbs) . ' buggy ATRs to fix.');

        DB::transaction(function () use ($buggyReimbs): void {
            foreach ($buggyReimbs as $r) {
                $itemsCount = $r->items->count();
                if ($itemsCount === 0) {
                    continue;
                }

                $targetTotal = (float) $r->amount;
                $amountPerItem = floor($targetTotal / $itemsCount);
                $remainder = $targetTotal - ($amountPerItem * $itemsCount);

                $this->info("Fixing ATR ID: {$r->id} | Code: {$r->code} | Total: {$targetTotal} | Items: {$itemsCount}");

                // Fix Items
                $first = true;
                foreach ($r->items as $item) {
                    $newAmount = $amountPerItem;
                    if ($first) {
                        $newAmount += $remainder;
                        $first = false;
                    }
                    $item->update([
                        'unit_price' => $newAmount,
                        'amount' => $newAmount,
                    ]);
                }

                // Group items by project_budget_detail_id to get the sum per detail
                $groupedItems = $r->items()->get()->groupBy('project_budget_detail_id');

                foreach ($r->atrBudgetSelecteds as $selected) {
                    $detailId = $selected->project_budget_detail_id;
                    $itemsForDetail = $groupedItems->get($detailId);

                    $sumForDetail = 0;
                    if ($itemsForDetail) {
                        $sumForDetail = $itemsForDetail->sum('amount');
                    }

                    $selected->update([
                        'amount' => $sumForDetail,
                    ]);

                    $this->line("  -> Updated Budget Selected Detail ID {$detailId} to {$sumForDetail}");
                }
            }
        });

        $this->info("\nAll buggy ATRs have been successfully fixed!");
    }
}
