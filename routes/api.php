<?php

use App\Http\Controllers\ProjectController;
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
});

Route::apiResource('projects', ProjectController::class);
Route::post('/store/projects', [ProjectController::class, 'storeProject']);