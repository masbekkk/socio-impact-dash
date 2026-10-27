<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\ReimbursementStatus;
use App\Enums\ReimbursementType;
use App\Models\Project;
use App\Models\Reimbursement;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final readonly class CheckAtrOperationalBudget
{
    public function __construct(private GetProjectAtrUsage $getProjectAtrUsage) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data, ?Reimbursement $existing = null): ?float
    {
        $type = $existing->type ?? ($data['type'] ?? null);
        $status = $data['status'] ?? ReimbursementStatus::Submitted;
        if (! in_array($type, [ReimbursementType::ATR, 'atr'], true)
            || in_array($status, [ReimbursementStatus::Draft, 'draft'], true)) {
            return null;
        }

        $projectId = array_key_exists('project_id', $data) ? $data['project_id'] : $existing?->project_id;
        if (! is_numeric($projectId) || (int) $projectId <= 0) {
            throw ValidationException::withMessages(['project_id' => 'Pilih proyek untuk pengajuan ATR.']);
        }

        return DB::transaction(function () use ($projectId, $existing, $data): float {
            // Submission and revision keep these locks until their enclosing write transaction commits.
            $projects = Project::query()
                ->whereIn('id', array_filter([(int) $projectId, $existing?->project_id]))
                ->orderBy('id')
                ->lockForUpdate()
                ->get();
            $project = $projects->firstWhere('id', (int) $projectId);
            if (! $project instanceof Project) {
                throw ValidationException::withMessages(['project_id' => 'Proyek tidak ditemukan.']);
            }
            $existing?->refresh();
            $amount = $this->requestedAmount($data, $existing);

            $pendingAtr = 0.0;
            foreach ($this->getProjectAtrUsage->handle($project) as $record) {
                if (! $record['converted'] && $record['id'] !== $existing?->id) {
                    $pendingAtr += $record['amount'];
                }
            }
            $eers = Reimbursement::query()->where('project_id', $project->id)
                ->where('type', 'eer')->whereNotIn('status', ['rejected', 'draft']);
            $usedEer = (float) (clone $eers)->sum('amount');
            $ownEer = $existing === null ? 0.0 : (float) (clone $eers)->where('atr_id', $existing->id)->sum('amount');
            $available = (float) $project->operational_budget - $pendingAtr - ($usedEer - $ownEer);

            // A revised ATR replaces its own reservation; its settled expenses remain committed.
            if (round(max($amount, $ownEer) * 100) > round($available * 100)) {
                throw ValidationException::withMessages([
                    'amount' => 'Nominal pengajuan ATR melebihi sisa pagu operasional proyek (Rp '.number_format(max(0, $available), 0, ',', '.').').',
                ]);
            }

            return $amount;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function requestedAmount(array $data, ?Reimbursement $existing): float
    {
        $totals = [];
        foreach (['items', 'selected_budget_details'] as $key) {
            if (! isset($data[$key])) {
                if ($existing !== null) {
                    $query = $key === 'items' ? $existing->items()->whereNull('parent_item_id') : $existing->atrBudgetSelecteds();
                    if ($query->exists()) {
                        $totals[] = (float) $query->sum('amount');
                    }
                }

                continue;
            }
            if (! is_array($data[$key])) {
                throw ValidationException::withMessages([$key => 'Rincian ATR tidak valid.']);
            }
            $total = 0.0;
            foreach ($data[$key] as $item) {
                if (! is_array($item) || ! isset($item['amount']) || ! is_numeric($item['amount']) || (float) $item['amount'] < 0) {
                    throw ValidationException::withMessages([$key => 'Nominal rincian ATR tidak valid.']);
                }
                $total += (float) $item['amount'];
            }
            $totals[] = $total;
        }
        if (isset($data['amount']) && is_numeric($data['amount'])) {
            $totals[] = (float) $data['amount'];
        }
        $amount = $totals[0] ?? (float) ($existing->amount ?? 0);
        foreach ($totals as $total) {
            if (round($total * 100) !== round($amount * 100)) {
                throw ValidationException::withMessages(['amount' => 'Total pengajuan ATR harus sama dengan total rincian item dan alokasi kegiatan.']);
            }
        }
        if ($amount <= 0) {
            throw ValidationException::withMessages(['amount' => 'Nominal pengajuan ATR harus lebih dari 0.']);
        }

        return $amount;
    }
}
