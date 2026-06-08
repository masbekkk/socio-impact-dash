<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\UserRole;
use App\Formatters\JsonResponseFormatter;
use App\Models\DivisionCode;
use App\Models\LetterCode;
use App\Models\LetterDivision;
use App\Models\LetterRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

final class LetterRequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = LetterRequest::with(['project', 'requester', 'pic', 'letterCode', 'letterDivision', 'division']);

        // Finance, Superadmin and Direktur can see all
        if (! $user->hasAnyRole([UserRole::Finance, UserRole::Superadmin, UserRole::Direktur])) {
            if ($user->hasRole(UserRole::Head)) {
                // Head can see:
                // 1. Their own letter requests
                // 2. Their team members' letter requests
                $query->where(function ($q) use ($user): void {
                    $q->where('requester_id', $user->id)
                        ->orWhereHas('requester', fn ($uq) => $uq->where('head_id', $user->id));
                });
            } else {
                $query->where('requester_id', $user->id);
            }
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function (\Illuminate\Database\Eloquent\Builder $q) use ($search): void {
                $q->where('subject', 'like', "%{$search}%")
                    ->orWhere('recipient', 'like', "%{$search}%")
                    ->orWhereHas('project', function (\Illuminate\Database\Eloquent\Builder $q) use ($search): void {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('code', 'like', "%{$search}%");
                    });
            });
        }

        // Date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('letter_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('letter_date', '<=', $request->date_to);
        }

        $letterRequests = $query->latest()->paginate($request->integer('per_page', 10));

        return JsonResponseFormatter::success(
            $letterRequests,
            'Letter requests retrieved successfully'
        );
    }

    public function show(string $id): JsonResponse
    {
        $letterRequest = LetterRequest::with(['project', 'requester', 'pic', 'letterCode', 'letterDivision', 'division'])->find($id);

        if (! $letterRequest) {
            return JsonResponseFormatter::notFound('Letter Request tidak ditemukan.');
        }

        return JsonResponseFormatter::success(
            $letterRequest,
            'Letter request retrieved successfully'
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'project_id' => ['required', 'exists:projects,id'],
            'letter_date' => ['required', 'date'],
            'recipient' => ['required', 'string', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            // 'pic_id' => 'required|exists:users,id',
            'division_id' => ['required', 'exists:division_codes,id'],
            'letter_code_id' => ['required', 'exists:letter_codes,id'],
            'letter_division_id' => ['required', 'exists:letter_divisions,id'],
            'keterangan' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:used,unused'],
        ]);

        $letterDate = \Illuminate\Support\Facades\Date::parse($validated['letter_date']);
        $kode = LetterCode::query()->find($validated['letter_code_id'])->code;
        $divisi = LetterDivision::query()->find($validated['letter_division_id'])->code;
        $divisionCode = DivisionCode::query()->find($validated['division_id']);
        $perusahaan = $divisionCode->code;

        $letterNumber = $this->generateLetterNumber($letterDate, $perusahaan, $kode, $divisi);

        $letterRequest = LetterRequest::query()->create([
            ...$validated,
            'requester_id' => $request->user()->id,
            'pic_id' => $request->user()->id,
            'approval_status' => 'pending',
            'letter_number' => $letterNumber,
            'status' => 'used',
        ]);

        return JsonResponseFormatter::created(
            $letterRequest,
            'Letter request created successfully'
        );
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $letterRequest = LetterRequest::query()->find($id);

        if (! $letterRequest) {
            return JsonResponseFormatter::notFound('Letter Request tidak ditemukan.');
        }

        // Only allow requester or admin to update
        $user = $request->user();
        if ($letterRequest->requester_id !== $user->id && ! $user->hasRole([UserRole::Finance, UserRole::Superadmin])) {
            return JsonResponseFormatter::error('Unauthorized', 403);
        }

        $validated = $request->validate([
            'project_id' => ['required', 'exists:projects,id'],
            'letter_date' => ['required', 'date'],
            'recipient' => ['required', 'string', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            // 'pic_id' => 'required|exists:users,id',
            'division_id' => ['required', 'exists:division_codes,id'],
            'letter_code_id' => ['required', 'exists:letter_codes,id'],
            'letter_division_id' => ['required', 'exists:letter_divisions,id'],
            'keterangan' => ['nullable', 'string'],
            // 'status' => ['required', 'in:used,unused'],
        ]);

        // If letter date, code, or division changed, technically the letter number should change too.
        // However, standard practice is to retain the number once generated, or regenerate it.
        // For now, we will regenerate it if those key fields changed.
        $needsNewNumber = false;

        $oldDate = \Illuminate\Support\Facades\Date::parse($letterRequest->letter_date);
        $newDate = \Illuminate\Support\Facades\Date::parse($validated['letter_date']);

        if ($oldDate->year !== $newDate->year ||
            $oldDate->month !== $newDate->month ||
            (int) $letterRequest->letter_code_id !== (int) $validated['letter_code_id'] ||
            (int) $letterRequest->letter_division_id !== (int) $validated['letter_division_id'] ||
            (int) $letterRequest->division_id !== (int) $validated['division_id']) {
            $needsNewNumber = true;
        }

        // If date changed, check if it became a backdate or needs a new backdate sequence
        if (! $needsNewNumber && $oldDate->toDateString() !== $newDate->toDateString()) {
            $perusahaan = DivisionCode::query()->find($validated['division_id'])->code;

            $latestIssued = LetterRequest::query()
                ->whereYear('letter_date', $newDate->year)
                ->whereNotNull('letter_number')
                ->where('id', '!=', $id)
                ->whereHas('division', fn ($q) => $q->where('code', $perusahaan))
                ->orderBy('letter_date', 'desc')
                ->orderBy('created_at', 'desc')
                ->first();

            $isBackdate = $latestIssued && $newDate->lt($latestIssued->letter_date->startOfDay());

            if ($isBackdate) {
                $needsNewNumber = true;
            }
        }

        if ($needsNewNumber) {
            $kode = LetterCode::query()->find($validated['letter_code_id'])->code;
            $divisi = LetterDivision::query()->find($validated['letter_division_id'])->code;
            $divisionCode = DivisionCode::query()->find($validated['division_id']);
            $perusahaan = $divisionCode->code;

            $validated['letter_number'] = $this->generateLetterNumber($newDate, $perusahaan, $kode, $divisi, (int) $id);
        }

        $letterRequest->update($validated);

        return JsonResponseFormatter::success(
            $letterRequest,
            'Letter request updated successfully'
        );
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $letterRequest = LetterRequest::query()->find($id);

        if (! $letterRequest) {
            return JsonResponseFormatter::notFound('Letter Request tidak ditemukan.');
        }

        $user = $request->user();
        if ($letterRequest->requester_id !== $user->id && ! $user->hasRole([UserRole::Finance, UserRole::Superadmin])) {
            return JsonResponseFormatter::error('Unauthorized', 403);
        }

        $letterRequest->delete();

        return JsonResponseFormatter::success(null, 'Letter request deleted successfully');
    }

    public function assignNumber(Request $request, LetterRequest $letterRequest): JsonResponse
    {
        $user = $request->user();
        if (! $user->hasRole([UserRole::Finance, UserRole::Superadmin])) {
            return JsonResponseFormatter::error('Unauthorized', 403);
        }

        $validated = $request->validate([
            'letter_number' => ['required', 'string', 'max:255'],
        ]);

        $letterRequest->update([
            'letter_number' => $validated['letter_number'],
            'approval_status' => 'assigned',
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
            'approval_status' => 'rejected',
        ]);

        return JsonResponseFormatter::success(
            $letterRequest,
            'Letter request rejected successfully'
        );
    }

    public function updateStatus(Request $request, LetterRequest $letterRequest): JsonResponse
    {
        $user = $request->user();
        // Assuming those who can delete or admins can update status.
        // Based on frontend requirement, those with 'canDelete' permission will call this.
        // We will allow requester or admins.
        if ($letterRequest->requester_id !== $user->id && ! $user->hasRole([UserRole::Finance, UserRole::Superadmin, UserRole::Direktur])) {
            return JsonResponseFormatter::error('Unauthorized', 403);
        }

        $validated = $request->validate([
            'status' => ['required', 'in:used,unused'],
        ]);

        $letterRequest->update(['status' => $validated['status']]);

        return JsonResponseFormatter::success(
            $letterRequest,
            'Status updated successfully'
        );
    }

    /**
     * Extract the base sequence number (without suffix) from a letter_number string.
     * e.g. "247/SPeng.BOD/Socim.id/3-2026" => 247
     * e.g. "247.A/SPeng.BOD/Socim.id/3-2026" => 247
     */
    private function extractBaseSeq(string $letterNumber): int
    {
        $parts = explode('/', $letterNumber);
        $basePart = explode('.', $parts[0]);

        return is_numeric($basePart[0]) ? (int) $basePart[0] : 0;
    }

    private function generateLetterNumber(
        \Carbon\CarbonInterface $letterDate,
        string $perusahaan,
        string $kode,
        string $divisi,
        ?int $ignoreId = null
    ): string {
        $year = $letterDate->year;
        $month = $letterDate->month;

        $startNumbers = [
            'Socim.id' => 247,
            'Lestari' => 63,
            'Sustim.id' => 27,
            'BKM' => 11,
            'EBLI' => 8,
        ];

        $baseQuery = fn () => LetterRequest::query()
            ->whereYear('letter_date', $year)
            ->whereNotNull('letter_number')
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->whereHas('division', fn ($q) => $q->where('code', $perusahaan));

        // 1. Get the latest letter by date for this company/year (to detect backdate)
        $latestByDate = $baseQuery()
            ->orderBy('letter_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->first();

        $isBackdate = $latestByDate && $letterDate->lt($latestByDate->letter_date->startOfDay());

        if (! $isBackdate) {
            // Normal: find max base sequence across all letters this year for this company
            $allRequests = $baseQuery()->get();
            $maxBaseSeq = $startNumbers[$perusahaan] ?? 1;
            foreach ($allRequests as $req) {
                $maxBaseSeq = max($maxBaseSeq, $this->extractBaseSeq((string) $req->letter_number));
            }

            $nextSeq = $latestByDate ? $maxBaseSeq + 1 : $maxBaseSeq;
            $formattedSeq = mb_str_pad((string) $nextSeq, 3, '0', STR_PAD_LEFT);

            return "{$formattedSeq}/{$kode}.{$divisi}/{$perusahaan}/{$month}-{$year}";
        }

        // --- Backdate logic ---
        // Find the nearest letter on or before the selected date
        $nearestBefore = $baseQuery()
            ->whereDate('letter_date', '<=', $letterDate->toDateString())
            ->orderBy('letter_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->first();

        if ($nearestBefore) {
            // Use the base seq from the nearest letter on/before this date
            $baseSeq = $this->extractBaseSeq((string) $nearestBefore->letter_number);
        } else {
            // No letter on or before this date — use the start number
            $baseSeq = $startNumbers[$perusahaan] ?? 1;
        }

        $baseStr = mb_str_pad((string) $baseSeq, 3, '0', STR_PAD_LEFT);

        // Find existing suffixes for this base across all letters this year
        $allRequests = $baseQuery()->get();
        $existingSuffixes = [];
        foreach ($allRequests as $req) {
            $parts = explode('/', (string) $req->letter_number);
            if (str_starts_with($parts[0], $baseStr.'.')) {
                $suffix = mb_substr($parts[0], mb_strlen($baseStr) + 1);
                $existingSuffixes[] = $suffix;
            }
        }

        $nextSuffix = 'A';
        if (! empty($existingSuffixes)) {
            sort($existingSuffixes);
            $lastSuffix = (string) end($existingSuffixes);
            $nextSuffix = ++$lastSuffix; // PHP's string increment: 'A' -> 'B', 'Z' -> 'AA'
        }

        return "{$baseStr}.{$nextSuffix}/{$kode}.{$divisi}/{$perusahaan}/{$month}-{$year}";
    }
}
