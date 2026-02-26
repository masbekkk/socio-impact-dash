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

final class DivisionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = DivisionCode::query()->with('divisions');

        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function (\Illuminate\Database\Eloquent\Builder $q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhereHas('divisions', function (\Illuminate\Database\Eloquent\Builder $nq) use ($search) {
                      $nq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $divisionCodes = $query->latest()->paginate($request->integer('per_page', 10));

        return JsonResponseFormatter::success(
            DivisionResource::collection($divisionCodes)->response()->getData(true),
            'Divisions retrieved successfully'
        );
    }

    public function store(StoreDivisionRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        $divisionCode = DivisionCode::create(['code' => $validated['code']]);
        
        foreach ($validated['names'] as $nameData) {
            $divisionCode->divisions()->create($nameData);
        }

        return JsonResponseFormatter::success(
            new DivisionResource($divisionCode->load('divisions')),
            'Division created successfully',
            201
        );
    }

    public function show(string $id): JsonResponse
    {
        $divisionCode = DivisionCode::with('divisions')->findOrFail($id);
        
        return JsonResponseFormatter::success(
            new DivisionResource($divisionCode),
            'Division retrieved successfully'
        );
    }

    public function update(UpdateDivisionRequest $request, string $id): JsonResponse
    {
        $divisionCode = DivisionCode::findOrFail($id);
        $validated = $request->validated();
        
        $divisionCode->update(['code' => $validated['code']]);
        
        // Replace all names with the newly provided ones
        $divisionCode->divisions()->delete();
        foreach ($validated['names'] as $nameData) {
            $divisionCode->divisions()->create($nameData);
        }

        return JsonResponseFormatter::success(
            new DivisionResource($divisionCode->load('divisions')),
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

        $divisionCode->delete();

        return JsonResponseFormatter::success(
            null,
            'Division deleted successfully'
        );
    }
}
