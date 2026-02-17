<?php

declare(strict_types=1);

use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\RoleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'can:view-admin'])->prefix('rbac')->group(function () {
    // Roles
    Route::get('roles', [RoleController::class, 'index']);
    Route::post('roles', [RoleController::class, 'store']);
    Route::get('roles/{role}', [RoleController::class, 'show']);
    Route::put('roles/{role}', [RoleController::class, 'update']);
    Route::delete('roles/{role}', [RoleController::class, 'destroy']);
    Route::post('roles/{role}/permissions', [RoleController::class, 'syncPermissions']);

    // Permissions
    Route::get('permissions', [PermissionController::class, 'index']);
    Route::post('permissions', [PermissionController::class, 'store']);
    Route::delete('permissions/{permission}', [PermissionController::class, 'destroy']);
});

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::post('projects/{project}/deal', [\App\Http\Controllers\Api\V1\ProjectController::class, 'deal']);
    Route::apiResource('projects', \App\Http\Controllers\Api\V1\ProjectController::class);
});
