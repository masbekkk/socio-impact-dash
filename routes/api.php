<?php

use App\Http\Controllers\Api\PresenceController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes (no auth required)
Route::post('/register', [UserProfileController::class, 'register']);
Route::post('/login', [UserProfileController::class, 'login']);

// Protected routes (auth required)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [UserProfileController::class, 'me']);
    Route::post('/logout', [UserProfileController::class, 'logout']);
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Presence / Attendance routes
    Route::prefix('presences')->group(function () {
        Route::post('/check-in', [PresenceController::class, 'checkIn']);
        Route::post('/check-out', [PresenceController::class, 'checkOut']);
        Route::post('/permission', [PresenceController::class, 'submitPermission']);
        Route::get('/today', [PresenceController::class, 'today']);
        Route::get('/history', [PresenceController::class, 'history']);
        Route::get('/summary', [PresenceController::class, 'monthlySummary']);
    });

    // Project routes
    Route::prefix('projects')->group(function () {
        Route::get('/list', [ProjectController::class, 'list']);
        Route::post('/', [ProjectController::class, 'store']);
        Route::put('/{project}', [ProjectController::class, 'update']);
        Route::delete('/{project}', [ProjectController::class, 'destroy']);
    });
});