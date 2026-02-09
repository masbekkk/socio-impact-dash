<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\DivisionController as AdminDivisionController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\LeaveController;
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
use App\Http\Controllers\CalendarController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => redirect()->route('projects.index'))->name('home');

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('dashboard', fn() => Inertia::render('Dashboard/Index'))->name('dashboard');

    // Presences
    Route::resource('presences', PresenceController::class)->only(['index', 'create', 'store', 'show']);

    // Projects
    Route::resource('projects', ProjectController::class);
    Route::get('projects/{project}/allowance', [ProjectController::class, 'allowance'])->name('projects.allowance');
    Route::post('projects/{project}/finish', [ProjectController::class, 'finish'])->name('projects.finish');

    // Reimbursements
    Route::get('reimbursements/create/atr', [ReimbursementController::class, 'createATR'])->name('reimbursements.create.atr');
    Route::get('reimbursements/create/eer', [ReimbursementController::class, 'createEER'])->name('reimbursements.create.eer');
    Route::get('reimbursements/approvals', [ReimbursementController::class, 'approvals'])->name('reimbursements.approvals');
    Route::resource('reimbursements', ReimbursementController::class);
    Route::post('reimbursements/{reimbursement}/approve', [ReimbursementController::class, 'approve'])->name('reimbursements.approve');
    Route::post('reimbursements/{reimbursement}/reject', [ReimbursementController::class, 'reject'])->name('reimbursements.reject');

    // Calendar
    Route::get('calendar', [CalendarController::class, 'index'])->name('calendar.index');

    // Leaves
    Route::get('leaves/create-travel', [LeaveController::class, 'createTravel'])->name('leaves.create_travel');
    Route::get('leaves/approvals', [LeaveController::class, 'approvals'])->name('leaves.approvals');
    Route::resource('leaves', LeaveController::class);
    Route::post('leaves/{leave}/approve', [LeaveController::class, 'approve'])->name('leaves.approve');
    Route::post('leaves/{leave}/reject', [LeaveController::class, 'reject'])->name('leaves.reject');

    // Presence
    Route::post('presences/check-in', [PresenceController::class, 'checkIn'])->name('presences.check-in');
    Route::get('presences', [PresenceController::class, 'index'])->name('presences.index');

    // Admin
    Route::prefix('admin')->middleware('can:adminAccess')->group(function (): void {
        Route::resource('users', AdminUserController::class);
        Route::resource('divisions', AdminDivisionController::class);
    });
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
    Route::get('settings/appearance', fn() => Inertia::render('appearance/update'))->name('appearance.edit');

    // User Two-Factor Authentication...
    Route::get('settings/two-factor', [UserTwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});

Route::middleware('guest')->group(function (): void {
    // User...
    Route::get('register', [UserController::class, 'create'])
        ->name('register');
    Route::post('register', [UserController::class, 'store'])
        ->name('register.store');

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
