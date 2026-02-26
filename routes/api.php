<?php

declare(strict_types=1);

use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\V1\LeaveController;
use App\Http\Controllers\Api\V1\ReimbursementController;
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
    Route::post('projects/{project}/deal', [App\Http\Controllers\Api\V1\ProjectController::class, 'deal']);
    Route::post('projects/{project}/approve', [App\Http\Controllers\Api\V1\ProjectApprovalController::class, 'approve']);
    Route::post('projects/{project}/reject', [App\Http\Controllers\Api\V1\ProjectApprovalController::class, 'reject']);
    Route::post('projects/{project}/close', [App\Http\Controllers\Api\V1\ProjectClosingController::class, 'close']);
    Route::post('projects/{project}/monitorings', [App\Http\Controllers\Api\V1\ProjectMonitoringController::class, 'store']);
    Route::post('projects/{project}/termins/{termin}', [App\Http\Controllers\Api\V1\ProjectTerminPaymentController::class, 'update']);
    Route::apiResource('projects', App\Http\Controllers\Api\V1\ProjectController::class);
    Route::apiResource('reimbursements', ReimbursementController::class)->only(['index', 'store', 'show']);
    Route::match(['patch', 'post'], 'reimbursements/{code}/status', [ReimbursementController::class, 'updateStatus']);

    // Letter Requests
    Route::apiResource('letter-requests', \App\Http\Controllers\Api\V1\LetterRequestController::class);
    Route::post('letter-requests/{letter_request}/assign', [\App\Http\Controllers\Api\V1\LetterRequestController::class, 'assignNumber']);
    Route::post('letter-requests/{letter_request}/reject', [\App\Http\Controllers\Api\V1\LetterRequestController::class, 'reject']);

    // Users
    Route::apiResource('users', \App\Http\Controllers\Api\V1\UserController::class);

    // Divisions
    Route::apiResource('divisions', \App\Http\Controllers\Api\V1\DivisionController::class);

    // Letter Master Data
    Route::apiResource('letter-codes', \App\Http\Controllers\Api\V1\LetterCodeController::class);
    Route::apiResource('letter-divisions', \App\Http\Controllers\Api\V1\LetterDivisionController::class);
    // Leaves
    Route::apiResource('leaves', LeaveController::class)->only(['index', 'store', 'show']);
    Route::post('leaves/{code}/status', [LeaveController::class, 'updateStatus']);
});
