<?php

declare(strict_types=1);

namespace App\Formatters;

use Illuminate\Http\JsonResponse;

final class JsonResponseFormatter
{
    public static function success(
        mixed $data = null,
        ?string $message = null,
        int $statusCode = 200
    ): JsonResponse {
        $response = [];

        if ($message !== null) {
            $response['message'] = $message;
        }

        $response['data'] = $data;

        return response()->json($response, $statusCode);
    }

    public static function created(
        mixed $data = null,
        ?string $message = null
    ): JsonResponse {
        return self::success($data, $message, 201);
    }

    public static function error(
        string $message,
        int $statusCode = 400,
        ?array $errors = null
    ): JsonResponse {
        $response = ['message' => $message];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $statusCode);
    }

    public static function notFound(string $message = 'Data tidak ditemukan.'): JsonResponse
    {
        return self::error($message, 404);
    }

    public static function unauthorized(string $message = 'Unauthorized.'): JsonResponse
    {
        return self::error($message, 401);
    }

    public static function forbidden(string $message = 'Forbidden.'): JsonResponse
    {
        return self::error($message, 403);
    }

    public static function validationError(array $errors, string $message = 'Validasi gagal.'): JsonResponse
    {
        return self::error($message, 422, $errors);
    }
}
