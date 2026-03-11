<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\DivisionController as AdminDivisionController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\LetterRequestController;
use App\Http\Controllers\PresenceController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReimbursementController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserEmailResetNotification;
use App\Http\Controllers\UserEmailVerification;
use App\Http\Controllers\UserEmailVerificationNotificationController;
use App\Http\Controllers\UserPasswordController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\UserTwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => to_route('dashboard'))->name('home');

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // Presences
    Route::resource('presences', PresenceController::class)->only(['index', 'create', 'store', 'show']);
    Route::post('presences/checkout', [PresenceController::class, 'checkOut'])->name('presences.checkout');

    // Projects
    Route::resource('projects', ProjectController::class)->only(['index', 'create', 'show', 'edit']);

    // Reimbursements
    Route::get('reimbursements/create/atr', [ReimbursementController::class, 'createATR'])->name('reimbursements.create.atr');
    Route::get('reimbursements/create/eer', [ReimbursementController::class, 'createEER'])->name('reimbursements.create.eer');
    Route::get('reimbursements/create/allowance', [ReimbursementController::class, 'createAllowance'])->name('reimbursements.create.allowance');
    Route::get('reimbursements/approvals', [ReimbursementController::class, 'approvals'])->name('reimbursements.approvals');
    Route::get('reimbursements/export-excel', [App\Http\Controllers\Api\V1\ReimbursementController::class, 'exportExcel'])->name('reimbursements.export-excel');
    Route::resource('reimbursements', ReimbursementController::class);
    Route::post('reimbursements/{reimbursement}/approve', [ReimbursementController::class, 'approve'])->name('reimbursements.approve');
    Route::post('reimbursements/{reimbursement}/reject', [ReimbursementController::class, 'reject'])->name('reimbursements.reject');

    // Letter Requests
    Route::resource('letter-requests', LetterRequestController::class)->only(['index', 'create', 'store', 'edit']);
    Route::post('letter-requests/{letter_request}/assign', [LetterRequestController::class, 'assignNumber'])->name('letter-requests.assign');
    Route::post('letter-requests/{letter_request}/reject', [LetterRequestController::class, 'reject'])->name('letter-requests.reject');

    // Calendar
    Route::get('calendar', [CalendarController::class, 'index'])->name('calendar.index');
    Route::post('calendar', [CalendarController::class, 'store'])->name('calendar.store');
    Route::delete('calendar/{id}', [CalendarController::class, 'destroy'])->name('calendar.destroy');
    Route::get('calendar/day/{date}', [CalendarController::class, 'show'])->name('calendar.show');

    // Leaves
    Route::get('leaves/create-travel', [LeaveController::class, 'createTravel'])->name('leaves.create_travel');
    Route::get('leaves/approvals', [LeaveController::class, 'approvals'])->name('leaves.approvals');
    Route::resource('leaves', LeaveController::class);
    Route::post('leaves/{leave}/approve', [LeaveController::class, 'approve'])->name('leaves.approve');
    Route::post('leaves/{leave}/reject', [LeaveController::class, 'reject'])->name('leaves.reject');

    // Admin
    Route::prefix('admin')->middleware('can:adminAccess')->group(function (): void {
        Route::resource('users', AdminUserController::class);
        Route::resource('divisions', AdminDivisionController::class);
        Route::resource('letter-codes', App\Http\Controllers\Admin\LetterCodeController::class)->except(['store', 'update', 'destroy']);
        Route::resource('letter-divisions', App\Http\Controllers\Admin\LetterDivisionController::class)->except(['store', 'update', 'destroy']);
        Route::get('rbac', fn () => Inertia::render('admin/rbac/index'))->name('admin.rbac');

        // Impersonation
        Route::post('users/{user}/impersonate', [App\Http\Controllers\Admin\ImpersonationController::class, 'impersonate'])->name('admin.users.impersonate');
    });

    Route::post('admin/stop-impersonating', [App\Http\Controllers\Admin\ImpersonationController::class, 'stop'])->name('admin.stop-impersonating');
});

Route::middleware('auth')->group(function (): void {
    // User...
    Route::delete('user', [UserController::class, 'destroy'])->name('user.destroy');

    // User Profile...
    Route::redirect('settings', '/settings/profile');
    Route::get('settings/profile', [UserProfileController::class, 'edit'])->name('user-profile.edit');
    Route::patch('settings/profile', [UserProfileController::class, 'update'])->name('user-profile.update');

    // User Password...
    Route::get('settings/password', [UserPasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [UserPasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('password.update');

    // Appearance...
    Route::get('settings/appearance', fn () => Inertia::render('appearance/update'))->name('appearance.edit');

    // User Two-Factor Authentication...
    Route::get('settings/two-factor', [UserTwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});

Route::middleware('guest')->group(function (): void {
    // User...
    // Route::get('register', [UserController::class, 'create'])
    //     ->name('register');
    // Route::post('register', [UserController::class, 'store'])
    //     ->name('register.store');

    // User Password...
    Route::get('reset-password/{token}', [UserPasswordController::class, 'create'])
        ->name('password.reset');
    Route::post('reset-password', [UserPasswordController::class, 'store'])
        ->name('password.store');

    // User Email Reset Notification...
    Route::get('forgot-password', [UserEmailResetNotification::class, 'create'])
        ->name('password.request');
    Route::post('forgot-password', [UserEmailResetNotification::class, 'store'])
        ->name('password.email');

    // Session...
    Route::get('login', [SessionController::class, 'create'])
        ->name('login');
    Route::post('login', [SessionController::class, 'store'])
        ->name('login.store');
});

Route::middleware('auth')->group(function (): void {
    // User Email Verification...
    Route::get('verify-email', [UserEmailVerificationNotificationController::class, 'create'])
        ->name('verification.notice');
    Route::post('email/verification-notification', [UserEmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // User Email Verification...
    Route::get('verify-email/{id}/{hash}', [UserEmailVerification::class, 'update'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    // Session...
    Route::post('logout', [SessionController::class, 'destroy'])
        ->name('logout');
});
