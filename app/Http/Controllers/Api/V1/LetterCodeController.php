<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class LetterCodeController
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $codes = \App\Models\LetterCode::all();

        return \App\Formatters\JsonResponseFormatter::success(
            \App\Http\Resources\V1\LetterCode\LetterCodeResource::collection($codes)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:letter_codes,code',
            'description' => 'nullable|string',
        ]);

        $code = \App\Models\LetterCode::create($validated);

        return \App\Formatters\JsonResponseFormatter::created(
            new \App\Http\Resources\V1\LetterCode\LetterCodeResource($code),
            'Letter Code berhasil dibuat.'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $code = \App\Models\LetterCode::find($id);

        if (! $code) {
            return \App\Formatters\JsonResponseFormatter::notFound('Letter Code tidak ditemukan.');
        }

        return \App\Formatters\JsonResponseFormatter::success(
            new \App\Http\Resources\V1\LetterCode\LetterCodeResource($code)
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $code = \App\Models\LetterCode::find($id);

        if (! $code) {
            return \App\Formatters\JsonResponseFormatter::notFound('Letter Code tidak ditemukan.');
        }

        $validated = $request->validate([
            'code' => 'required|string|unique:letter_codes,code,'.$code->id,
            'description' => 'nullable|string',
        ]);

        $code->update($validated);

        return \App\Formatters\JsonResponseFormatter::success(
            new \App\Http\Resources\V1\LetterCode\LetterCodeResource($code),
            'Letter Code berhasil diperbarui.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $code = \App\Models\LetterCode::find($id);

        if (! $code) {
            return \App\Formatters\JsonResponseFormatter::notFound('Letter Code tidak ditemukan.');
        }

        $code->delete();

        return \App\Formatters\JsonResponseFormatter::success(null, 'Letter Code berhasil dihapus.');
    }
}
