<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Formatters\JsonResponseFormatter;
use App\Http\Requests\Divisions\StoreDivisionRequest;
use App\Http\Requests\Divisions\UpdateDivisionRequest;
use App\Http\Resources\V1\Division\DivisionResource;
use App\Models\Division;
use App\Models\DivisionCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;

final class DivisionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Division::query()->with('divisionCode');

        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function (\Illuminate\Database\Eloquent\Builder $q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('divisionCode', function (\Illuminate\Database\Eloquent\Builder $nq) use ($search): void {
                        $nq->where('code', 'like', "%{$search}%")
                            ->orWhere('name', 'like', "%{$search}%");
                    });
            });
        }

        $divisions = $query->latest()->paginate($request->integer('per_page', 10));

        return JsonResponseFormatter::success(
            DivisionResource::collection($divisions)->response()->getData(true),
            'Divisions retrieved successfully'
        );
    }

    public function store(StoreDivisionRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $divisionCode = DivisionCode::query()->create([
            'code' => $validated['code'],
            'name' => $validated['name'],
        ]);

        foreach ($validated['names'] as $nameData) {
            $divisionCode->divisions()->create($nameData);
        }

        return JsonResponseFormatter::success(
            [
                'id' => $divisionCode->id,
                'code' => $divisionCode->code,
                'name' => $divisionCode->name,
                'names' => $divisionCode->divisions->map(fn ($d): array => [
                    'id' => $d->id,
                    'name' => $d->name,
                    'description' => $d->description,
                ]),
            ],
            'Division created successfully',
            201
        );
    }

    public function show(string $id): JsonResponse
    {
        $divisionCode = DivisionCode::with('divisions')->findOrFail($id);

        return JsonResponseFormatter::success(
            [
                'id' => $divisionCode->id,
                'code' => $divisionCode->code,
                'name' => $divisionCode->name,
                'names' => $divisionCode->divisions->map(fn ($d): array => [
                    'id' => $d->id,
                    'name' => $d->name,
                    'description' => $d->description,
                ]),
            ],
            'Division retrieved successfully'
        );
    }

    public function update(UpdateDivisionRequest $request, string $id): JsonResponse
    {
        $divisionCode = DivisionCode::query()->findOrFail($id);

        /** @var array{code: string, name: string, names: array<int, array{id?: int|null, name: string, description?: string|null}>} $validated */
        $validated = $request->validated();

        $keptIds = array_values(array_filter(array_map(
            fn (array $nameData): ?int => isset($nameData['id']) ? (int) $nameData['id'] : null,
            $validated['names']
        )));

        $removedDivisions = $divisionCode->divisions()->whereNotIn('id', $keptIds)->get();

        foreach ($removedDivisions as $division) {
            if ($division->projects()->exists()) {
                return JsonResponseFormatter::error(
                    'Cannot remove division "'.$division->name.'" because it has associated projects.',
                    400
                );
            }

            if ($division->users()->exists()) {
                return JsonResponseFormatter::error(
                    'Cannot remove division "'.$division->name.'" because it has associated users.',
                    400
                );
            }
        }

        DB::transaction(function () use ($divisionCode, $validated, $removedDivisions): void {
            $divisionCode->update([
                'code' => $validated['code'],
                'name' => $validated['name'],
            ]);

            foreach ($validated['names'] as $nameData) {
                $attributes = [
                    'name' => $nameData['name'],
                    'description' => $nameData['description'] ?? null,
                ];

                // Existing names keep their row (and id); only new names are inserted.
                if (isset($nameData['id'])) {
                    /** @var Division $division */
                    $division = $divisionCode->divisions()->findOrFail((int) $nameData['id']);
                    $division->update($attributes);

                    continue;
                }

                $divisionCode->divisions()->create($attributes);
            }

            foreach ($removedDivisions as $division) {
                $division->delete();
            }
        });

        $divisionCode->load('divisions');

        return JsonResponseFormatter::success(
            [
                'id' => $divisionCode->id,
                'code' => $divisionCode->code,
                'name' => $divisionCode->name,
                'names' => $divisionCode->divisions->map(fn ($d): array => [
                    'id' => $d->id,
                    'name' => $d->name,
                    'description' => $d->description,
                ]),
            ],
            'Division updated successfully'
        );
    }
}
