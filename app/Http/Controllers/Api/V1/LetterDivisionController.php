<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class LetterDivisionController
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $divisions = \App\Models\LetterDivision::all();

        return \App\Formatters\JsonResponseFormatter::success(
            \App\Http\Resources\V1\LetterDivision\LetterDivisionResource::collection($divisions)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'unique:letter_divisions,code'],
            'description' => ['nullable', 'string'],
        ]);

        $division = \App\Models\LetterDivision::query()->create($validated);

        return \App\Formatters\JsonResponseFormatter::created(
            new \App\Http\Resources\V1\LetterDivision\LetterDivisionResource($division),
            'Letter Division berhasil dibuat.'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $division = \App\Models\LetterDivision::query()->find($id);

        if (! $division) {
            return \App\Formatters\JsonResponseFormatter::notFound('Letter Division tidak ditemukan.');
        }

        return \App\Formatters\JsonResponseFormatter::success(
            new \App\Http\Resources\V1\LetterDivision\LetterDivisionResource($division)
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $division = \App\Models\LetterDivision::query()->find($id);

        if (! $division) {
            return \App\Formatters\JsonResponseFormatter::notFound('Letter Division tidak ditemukan.');
        }

        $validated = $request->validate([
            'code' => 'required|string|unique:letter_divisions,code,'.$division->id,
            'description' => ['nullable', 'string'],
        ]);

        $division->update($validated);

        return \App\Formatters\JsonResponseFormatter::success(
            new \App\Http\Resources\V1\LetterDivision\LetterDivisionResource($division),
            'Letter Division berhasil diperbarui.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $division = \App\Models\LetterDivision::query()->find($id);

        if (! $division) {
            return \App\Formatters\JsonResponseFormatter::notFound('Letter Division tidak ditemukan.');
        }

        $division->delete();

        return \App\Formatters\JsonResponseFormatter::success(null, 'Letter Division berhasil dihapus.');
    }
}
