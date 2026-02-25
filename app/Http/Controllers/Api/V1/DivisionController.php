<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Formatters\JsonResponseFormatter;
use App\Http\Requests\Divisions\StoreDivisionRequest;
use App\Http\Requests\Divisions\UpdateDivisionRequest;
use App\Http\Resources\V1\Division\DivisionResource;
use App\Models\Division;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

final class DivisionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Division::query();

        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function (\Illuminate\Database\Eloquent\Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $divisions = $query->latest()->paginate($request->integer('per_page', 10));

        return JsonResponseFormatter::success(
            DivisionResource::collection($divisions)->response()->getData(true),
            'Divisions retrieved successfully'
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDivisionRequest $request): JsonResponse
    {
        $division = Division::create($request->validated());

        return JsonResponseFormatter::success(
            new DivisionResource($division),
            'Division created successfully',
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Division $division): JsonResponse
    {
        return JsonResponseFormatter::success(
            new DivisionResource($division),
            'Division retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDivisionRequest $request, Division $division): JsonResponse
    {
        $division->update($request->validated());

        return JsonResponseFormatter::success(
            new DivisionResource($division),
            'Division updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Division $division): JsonResponse
    {
        // Check if division has projects
        if ($division->projects()->exists()) {
            return JsonResponseFormatter::error(
                null,
                'Cannot delete division because it has associated projects.',
                400
            );
        }

        $division->delete();

        return JsonResponseFormatter::success(
            null,
            'Division deleted successfully'
        );
    }
}
