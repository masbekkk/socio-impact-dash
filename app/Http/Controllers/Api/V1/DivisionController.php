<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Formatters\JsonResponseFormatter;
use App\Http\Requests\Divisions\StoreDivisionRequest;
use App\Http\Requests\Divisions\UpdateDivisionRequest;
use App\Http\Resources\V1\Division\DivisionResource;
use App\Models\DivisionCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

final class DivisionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = \App\Models\Division::query()->with('divisionCode');

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
        $validated = $request->validated();

        $divisionCode->update([
            'code' => $validated['code'],
            'name' => $validated['name'],
        ]);

        // Replace all names with the newly provided ones
        $divisionCode->divisions()->delete();
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
            'Division updated successfully'
        );
    }

    public function destroy(string $id): JsonResponse
    {
        $divisionCode = DivisionCode::with('divisions')->findOrFail($id);

        // Check if any of its divisions have projects
        foreach ($divisionCode->divisions as $division) {
            if ($division->projects()->exists()) {
                return JsonResponseFormatter::error(
                    null,
                    'Cannot delete division code because it has associated projects.',
                    400
                );
            }
        }

        // Also check users
        foreach ($divisionCode->divisions as $division) {
            if ($division->users()->exists()) {
                return JsonResponseFormatter::error(
                    null,
                    'Cannot delete division because it has associated users.',
                    400
                );
            }
        }

        $divisionCode->delete();

        return JsonResponseFormatter::success(
            null,
            'Division deleted successfully'
        );
    }
}
