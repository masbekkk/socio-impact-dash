<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use App\Models\UserKpi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Validation\Rule;

final class UserKpiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $search = $request->string('search')->trim()->toString();
        $year = $request->integer('year');

        $query = UserKpi::with('user:id,name,email,position')
            ->when($search !== '', function ($q) use ($search): void {
                $q->whereHas('user', function ($uq) use ($search): void {
                    $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($year > 0, function ($q) use ($year): void {
                $q->where('year', $year);
            })
            ->orderBy('year', 'desc')
            ->orderBy('id', 'desc');

        $kpis = $query->paginate(15);

        return response()->json([
            'status' => 'success',
            'data' => $kpis,
        ]);
    }

    public function heads(): JsonResponse
    {
        $heads = User::role('head')
            ->select(['id', 'name', 'email', 'position'])
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $heads,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id'),
            ],
            'nominal' => ['required', 'numeric', 'min:0'],
            'year' => ['required', 'integer', 'min:2000', 'max:2100'],
        ]);

        // Ensure user has role 'head'
        $user = User::findOrFail($validated['user_id']);
        if (! $user->hasRole('head')) {
            return response()->json([
                'status' => 'error',
                'message' => 'KPI hanya dapat diinput untuk user yang memiliki role Head.',
            ], 422);
        }

        // Check if KPI for user and year already exists
        $existing = UserKpi::where('user_id', $validated['user_id'])
            ->where('year', $validated['year'])
            ->first();

        if ($existing) {
            return response()->json([
                'status' => 'error',
                'message' => "KPI untuk user {$user->name} pada tahun {$validated['year']} sudah ada.",
            ], 422);
        }

        $kpi = UserKpi::create($validated);
        $kpi->load('user:id,name,email,position');

        return response()->json([
            'status' => 'success',
            'message' => 'KPI berhasil ditambahkan.',
            'data' => $kpi,
        ], 201);
    }

    public function update(Request $request, UserKpi $userKpi): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id'),
            ],
            'nominal' => ['required', 'numeric', 'min:0'],
            'year' => ['required', 'integer', 'min:2000', 'max:2100'],
        ]);

        $user = User::findOrFail($validated['user_id']);
        if (! $user->hasRole('head')) {
            return response()->json([
                'status' => 'error',
                'message' => 'KPI hanya dapat diinput untuk user yang memiliki role Head.',
            ], 422);
        }

        // Check duplicate if user_id or year changed
        $existing = UserKpi::where('user_id', $validated['user_id'])
            ->where('year', $validated['year'])
            ->where('id', '!=', $userKpi->id)
            ->first();

        if ($existing) {
            return response()->json([
                'status' => 'error',
                'message' => "KPI untuk user {$user->name} pada tahun {$validated['year']} sudah ada.",
            ], 422);
        }

        $userKpi->update($validated);
        $userKpi->load('user:id,name,email,position');

        return response()->json([
            'status' => 'success',
            'message' => 'KPI berhasil diperbarui.',
            'data' => $userKpi,
        ]);
    }

    public function destroy(UserKpi $userKpi): JsonResponse
    {
        $userKpi->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'KPI berhasil dihapus.',
        ]);
    }
}
