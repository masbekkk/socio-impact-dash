<?php

declare(strict_types=1);

use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\V1\LeaveController;
use App\Http\Controllers\Api\V1\ReimbursementController;
use App\Http\Controllers\CalendarController;
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
    Route::delete('projects/{project}/monitorings/{monitoring}', [App\Http\Controllers\Api\V1\ProjectMonitoringController::class, 'destroy']);
    Route::post('projects/{project}/termins/{termin}', [App\Http\Controllers\Api\V1\ProjectTerminPaymentController::class, 'update']);
    Route::apiResource('projects', App\Http\Controllers\Api\V1\ProjectController::class)->names('api.projects');
    Route::apiResource('reimbursements', ReimbursementController::class)->only(['index', 'store', 'destroy'])->names('api.reimbursements');
    Route::prefix('reimbursements')->group(function () {
        Route::get('/export-excel', [ReimbursementController::class, 'exportExcel'])->name('api.reimbursements.exportExcel');
        Route::get('/{reimbursement}', [ReimbursementController::class, 'show'])->name('api.reimbursements.show');
        Route::post('/{reimbursement}/status', [ReimbursementController::class, 'updateStatus'])->name('api.reimbursements.status');
        Route::patch('/{reimbursement}/budgets', [ReimbursementController::class, 'updateBudgets'])->name('api.reimbursements.budgets.update');
        Route::patch('/{reimbursement}/code', [ReimbursementController::class, 'updateCode'])->name('api.reimbursements.code.update');
        Route::post('/{reimbursement}/resubmit', [ReimbursementController::class, 'resubmit'])->name('api.reimbursements.resubmit');
        Route::post('/{reimbursement}/comments', [App\Http\Controllers\Api\V1\ReimbursementCommentController::class, 'store'])->name('api.reimbursements.comments.store');
    });

    // Letter Requests
    Route::apiResource('letter-requests', App\Http\Controllers\Api\V1\LetterRequestController::class)->names('api.letter-requests');
    Route::post('letter-requests/{letter_request}/assign', [App\Http\Controllers\Api\V1\LetterRequestController::class, 'assignNumber']);
    Route::post('letter-requests/{letter_request}/reject', [App\Http\Controllers\Api\V1\LetterRequestController::class, 'reject']);

    // Users
    Route::apiResource('users', App\Http\Controllers\Api\V1\UserController::class)->names('api.users');

    // Divisions
    Route::apiResource('divisions', App\Http\Controllers\Api\V1\DivisionController::class)->names('api.divisions');

    // Letter Master Data
    Route::apiResource('letter-codes', App\Http\Controllers\Api\V1\LetterCodeController::class)->names('api.letter-codes');
    Route::apiResource('letter-divisions', App\Http\Controllers\Api\V1\LetterDivisionController::class)->names('api.letter-divisions');
    // Leaves
    Route::apiResource('leaves', LeaveController::class)->only(['index', 'store', 'show'])->names('api.leaves');
    Route::post('leaves/{code}/status', [LeaveController::class, 'updateStatus']);
    // Calendar
    Route::get('calendar', [CalendarController::class, 'index'])->name('api.v1.calendar.index');
    Route::post('calendar', [CalendarController::class, 'store'])->name('api.v1.calendar.store');
    Route::delete('calendar/{id}', [CalendarController::class, 'destroy'])->name('api.v1.calendar.destroy');

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [App\Http\Controllers\Api\V1\NotificationController::class, 'index'])->name('api.v1.notifications.index');
        Route::get('/unread-count', [App\Http\Controllers\Api\V1\NotificationController::class, 'unreadCount'])->name('api.v1.notifications.unread-count');
        Route::post('/{id}/read', [App\Http\Controllers\Api\V1\NotificationController::class, 'markAsRead'])->name('api.v1.notifications.read');
        Route::post('/read-all', [App\Http\Controllers\Api\V1\NotificationController::class, 'markAllRead'])->name('api.v1.notifications.read-all');
    });
});
