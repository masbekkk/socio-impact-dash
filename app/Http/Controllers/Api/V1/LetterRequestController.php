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
            'status' => 'pending',
            'letter_number' => $letterNumber,
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
        ]);

        // If letter date, code, or division changed, technically the letter number should change too.
        // However, standard practice is to retain the number once generated, or regenerate it.
        // For now, we will regenerate it if those key fields changed.
        $needsNewNumber = false;

        $oldDate = \Illuminate\Support\Facades\Date::parse($letterRequest->letter_date);
        $newDate = \Illuminate\Support\Facades\Date::parse($validated['letter_date']);

        if ($oldDate->year !== $newDate->year ||
            $oldDate->month !== $newDate->month ||
            $letterRequest->letter_code_id !== $validated['letter_code_id'] ||
            $letterRequest->letter_division_id !== $validated['letter_division_id'] ||
            $letterRequest->division_id !== $validated['division_id']) {
            $needsNewNumber = true;
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

        // 1. Get the latest letter issued for this company and year (to find if it's a backdate)
        $latestIssued = LetterRequest::query()
            ->whereYear('letter_date', $year)
            ->whereNotNull('letter_number')
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->whereHas('division', fn ($q) => $q->where('code', $perusahaan))
            ->orderBy('letter_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->first();

        // 2. Get all requests for this year/company to find max sequence and existing suffixes
        $allRequests = LetterRequest::query()
            ->whereYear('letter_date', $year)
            ->whereNotNull('letter_number')
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->whereHas('division', fn ($q) => $q->where('code', $perusahaan))
            ->get();

        $maxBaseSeq = $startNumbers[$perusahaan] ?? 1;
        foreach ($allRequests as $req) {
            $parts = explode('/', (string) $req->letter_number);
            $basePart = explode('.', $parts[0])[0];
            if (is_numeric($basePart)) {
                $maxBaseSeq = max($maxBaseSeq, (int) $basePart);
            }
        }

        $isBackdate = $latestIssued && $letterDate->lt($latestIssued->letter_date->startOfDay());

        if (! $isBackdate) {
            // Normal numbering: increment maxBaseSeq if we actually found existing letters,
            // or if we are at the start number and it was already used.
            $nextSeq = $maxBaseSeq;
            if ($latestIssued) {
                $nextSeq = $maxBaseSeq + 1;
            }
            $formattedSeq = mb_str_pad((string) $nextSeq, 3, '0', STR_PAD_LEFT);

            return "{$formattedSeq}/{$kode}.{$divisi}/{$perusahaan}/{$month}-{$year}";
        }

        // Backdate logic: Use maxBaseSeq and add alphabet suffix
        $baseStr = mb_str_pad((string) $maxBaseSeq, 3, '0', STR_PAD_LEFT);

        // Find existing suffixes for this base
        $existingSuffixes = [];
        foreach ($allRequests as $req) {
            $parts = explode('/', (string) $req->letter_number);
            if (str_starts_with($parts[0], $baseStr . '.')) {
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
