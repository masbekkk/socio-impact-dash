<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\UserRole;
use App\Formatters\JsonResponseFormatter;
use App\Models\Division;
use App\Models\LetterCode;
use App\Models\LetterDivision;
use App\Models\LetterRequest;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

final class LetterRequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = LetterRequest::with(['project', 'requester', 'pic', 'letterCode', 'letterDivision', 'division']);

        // Finance and Superadmin can see all
        if (! $user->hasRole([UserRole::Finance, UserRole::Superadmin])) {
            $query->where('requester_id', $user->id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function (\Illuminate\Database\Eloquent\Builder $q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                    ->orWhere('recipient', 'like', "%{$search}%")
                    ->orWhereHas('project', function (\Illuminate\Database\Eloquent\Builder $q) use ($search) {
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
            'project_id' => 'required|exists:projects,id',
            'letter_date' => 'required|date',
            'recipient' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            // 'pic_id' => 'required|exists:users,id',
            'division_id' => 'required|exists:divisions,id',
            'letter_code_id' => 'required|exists:letter_codes,id',
            'letter_division_id' => 'required|exists:letter_divisions,id',
            'keterangan' => 'nullable|string',
        ]);

        $letterDate = Carbon::parse($validated['letter_date']);
        $year = $letterDate->year;
        $month = $letterDate->month;

        $kode = LetterCode::find($validated['letter_code_id'])->code;
        $divisi = LetterDivision::find($validated['letter_division_id'])->code;
        $division = Division::where('id', $validated['division_id'])->with('divisionCode')->first();
        $perusahaan = $division->divisionCode->code;

        $startNumbers = [
            'Socim.id' => 247,
            'Lestari' => 63,
            'Sustim.id' => 27,
            'BKM' => 11,
            'EBLI' => 8,
        ];

        $latestRequest = LetterRequest::whereYear('letter_date', $year)
            ->whereNotNull('letter_number')
            ->whereHas('division', function ($query) use ($perusahaan) {
                $query->whereHas('divisionCode', function ($q) use ($perusahaan) {
                    $q->where('code', $perusahaan);
                });
            })
            ->orderByRaw('CAST(SUBSTRING_INDEX(letter_number, "/", 1) AS UNSIGNED) DESC')
            ->first();

        $nextNo = $startNumbers[$perusahaan] ?? 1;
        if ($latestRequest) {
            $parts = explode('/', $latestRequest->letter_number);
            if (count($parts) > 0 && is_numeric($parts[0])) {
                $currentSeq = (int) $parts[0];
                $nextNo = max($nextNo, $currentSeq + 1);
            }
        }

        $formattedNo = mb_str_pad((string) $nextNo, 3, '0', STR_PAD_LEFT);
        $letterNumber = "{$formattedNo}/{$kode}.{$divisi}/{$perusahaan}/{$month}-{$year}";

        $letterRequest = LetterRequest::create([
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
        $letterRequest = LetterRequest::find($id);

        if (! $letterRequest) {
            return JsonResponseFormatter::notFound('Letter Request tidak ditemukan.');
        }

        // Only allow requester or admin to update
        $user = $request->user();
        if ($letterRequest->requester_id !== $user->id && ! $user->hasRole([UserRole::Finance, UserRole::Superadmin])) {
            return JsonResponseFormatter::error('Unauthorized', 403);
        }

        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'letter_date' => 'required|date',
            'recipient' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            // 'pic_id' => 'required|exists:users,id',
            'division_id' => 'required|exists:divisions,id',
            'letter_code_id' => 'required|exists:letter_codes,id',
            'letter_division_id' => 'required|exists:letter_divisions,id',
            'keterangan' => 'nullable|string',
        ]);

        // If letter date, code, or division changed, technically the letter number should change too.
        // However, standard practice is to retain the number once generated, or regenerate it.
        // For now, we will regenerate it if those key fields changed.
        $needsNewNumber = false;

        $oldDate = Carbon::parse($letterRequest->letter_date);
        $newDate = Carbon::parse($validated['letter_date']);

        if ($oldDate->year !== $newDate->year ||
            $oldDate->month !== $newDate->month ||
            $letterRequest->letter_code_id !== $validated['letter_code_id'] ||
            $letterRequest->letter_division_id !== $validated['letter_division_id'] ||
            $letterRequest->division_id !== $validated['division_id']) {
            $needsNewNumber = true;
        }

        if ($needsNewNumber) {
            $year = $newDate->year;
            $month = $newDate->month;
            $kode = LetterCode::find($validated['letter_code_id'])->code;
            $divisi = LetterDivision::find($validated['letter_division_id'])->code;
            $division = Division::where('id', $validated['division_id'])->with('divisionCode')->first();
            $perusahaan = $division->divisionCode->code;

            $startNumbers = [
                'Socim.id' => 247,
                'Lestari' => 63,
                'Sustim.id' => 27,
                'BKM' => 11,
                'EBLI' => 8,
            ];

            // If company didn't change and year didn't change, we can potentially keep the sequence number.
            // But if it did, or if we want to be safe and always get the latest sequence for that company/year:

            $oldDivision = Division::where('id', $letterRequest->division_id)->with('divisionCode')->first();
            $oldPerusahaan = $oldDivision->divisionCode->code;

            if ($oldPerusahaan === $perusahaan && $oldDate->year === $newDate->year) {
                // Keep same sequence number if same company and year
                $currentParts = explode('/', $letterRequest->letter_number);
                $seqNo = (count($currentParts) > 0 && is_numeric($currentParts[0])) ? $currentParts[0] : '001';
            } else {
                // Get next number for the new company/year
                $latestRequest = LetterRequest::whereYear('letter_date', $year)
                    ->whereNotNull('letter_number')
                    ->where('id', '!=', $letterRequest->id) // Don't count itself
                    ->whereHas('division', function ($query) use ($perusahaan) {
                        $query->whereHas('divisionCode', function ($q) use ($perusahaan) {
                            $q->where('code', $perusahaan);
                        });
                    })
                    ->orderByRaw('CAST(SUBSTRING_INDEX(letter_number, "/", 1) AS UNSIGNED) DESC')
                    ->first();

                $nextNo = $startNumbers[$perusahaan] ?? 1;
                if ($latestRequest) {
                    $parts = explode('/', $latestRequest->letter_number);
                    if (count($parts) > 0 && is_numeric($parts[0])) {
                        $currentSeq = (int) $parts[0];
                        $nextNo = max($nextNo, $currentSeq + 1);
                    }
                }
                $seqNo = mb_str_pad((string) $nextNo, 3, '0', STR_PAD_LEFT);
            }

            $letterNumber = "{$seqNo}/{$kode}.{$divisi}/{$perusahaan}/{$month}-{$year}";
            $validated['letter_number'] = $letterNumber;
        }

        $letterRequest->update($validated);

        return JsonResponseFormatter::success(
            $letterRequest,
            'Letter request updated successfully'
        );
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $letterRequest = LetterRequest::find($id);

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
            'letter_number' => 'required|string|max:255',
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
}
