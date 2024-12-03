<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\IpRestrictionController;
use App\Http\Controllers\Admin\LoginAttemptController;
use App\Http\Controllers\Admin\MediaCategoryController;
use App\Http\Controllers\Admin\MediaCollectionController;
use App\Http\Controllers\Admin\MediaFileController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\PageTemplateController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\RoleTemplateController;
use App\Http\Controllers\Admin\SecurityController;
use App\Http\Controllers\Admin\SecuritySettingController;
use App\Http\Controllers\Admin\SessionActivityController;
use App\Http\Controllers\Admin\SessionController;
use App\Http\Controllers\Admin\TwoFactorController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\UserProfileController;
use App\Http\Controllers\Admin\UserRoleController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Http\Controllers\TwoFactorAuthenticatedSessionController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/debug-session', function () {
    return [
        'lifetime' => config('session.lifetime'),
        'driver' => config('session.driver'),
        'domain' => config('session.domain'),
    ];
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

//Route::middleware(['web', 'check.ip'])->group(function () {
//    // Your auth routes here
//});
// ,  'verified', 'admin'
// Admin routes
Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::prefix('admin')->name('admin.')->group(function () {
        // Dashboard
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

        // User management
        Route::middleware(['auth', 'verified', 'permission:view-users'])->group(function () {
            Route::resource('users', UserController::class);
        });
        Route::get('/users/{user}/activity', [UserController::class, 'activityLog'])
            ->name('users.activity');

        // Profile routes
        Route::get('/users/{user}/profile', [UserProfileController::class, 'show'])->name('users.profile.show');
        Route::get('/users/{user}/profile/edit', [UserProfileController::class, 'edit'])->name('users.profile.edit');
        Route::post('/users/{user}/profile', [UserProfileController::class, 'update'])->name('users.profile.update');

        // User management routes
        Route::post('users/bulk-action', [UserController::class, 'bulkAction'])->name('users.bulk-action');
        Route::post('users/export', [UserController::class, 'export'])->name('users.export');

        Route::middleware(['auth', 'verified', 'permission:manage-roles'])->group(function () {
            Route::resource('roles', RoleController::class)->except(['show']);;
        });

        Route::middleware(['auth', 'verified', 'permission:manage-permissions'])->group(function () {
            Route::resource('permissions', PermissionController::class);
        });
        // Role Templates
        Route::prefix('roles/templates')->name('roles.templates.')->group(function () {
            Route::get('/', [RoleTemplateController::class, 'index'])->name('index');
            Route::get('/create', [RoleTemplateController::class, 'create'])->name('create');
            Route::post('/', [RoleTemplateController::class, 'store'])->name('store');
            Route::get('/{template}/edit', [RoleTemplateController::class, 'edit'])->name('edit');
            Route::put('/{template}', [RoleTemplateController::class, 'update'])->name('update');
            Route::delete('/{template}', [RoleTemplateController::class, 'destroy'])->name('destroy');
            Route::post('/{template}/create-role', [RoleTemplateController::class, 'createRole'])->name('create-role');

            Route::get('{template}/versions', [RoleTemplateController::class, 'versions'])->name('versions');
            Route::get('{template}/compare', [RoleTemplateController::class, 'compareVersions'])->name('compare');
            Route::post('{template}/versions', [RoleTemplateController::class, 'createVersion'])->name('create-version');
            Route::post('{template}/revert', [RoleTemplateController::class, 'revertToVersion'])->name('revert');
            Route::post('{template}/duplicate', [RoleTemplateController::class, 'duplicate'])->name('duplicate');
            // Role template version management
            Route::prefix('{template}/versions')->name('versions.')->group(function () {
                Route::delete('batch', [RoleTemplateController::class, 'batchDeleteVersions'])->name('batch-delete');
                Route::post('batch/archive', [RoleTemplateController::class, 'batchArchiveVersions'])->name('batch-archive');
                Route::post('{version}/unarchive', [RoleTemplateController::class, 'unarchiveVersion'])->name('unarchive');
                Route::get('archived', [RoleTemplateController::class, 'getArchivedVersions'])->name('archived');
            });

            Route::get('/export', [RoleTemplateController::class, 'export'])->name('export');
            Route::post('/import', [RoleTemplateController::class, 'import'])->name('import');
        });

        // Two-Factor Authentication routes
        Route::prefix('security')->name('security.')->group(function () {
            Route::get('/', [SecurityController::class, 'dashboard'])->name('dashboard');
            Route::get('/2fa', [TwoFactorController::class, 'show'])->name('2fa');
            Route::post('/2fa/enable', [TwoFactorController::class, 'enable'])->name('2fa.enable');
            Route::post('/2fa/disable', [TwoFactorController::class, 'disable'])->name('2fa.disable');
            Route::post('/2fa/regenerate', [TwoFactorController::class, 'regenerateRecoveryCodes'])->name('2fa.regenerate');

            Route::get('/settings', [SecuritySettingController::class, 'edit'])->name('settings');
            Route::post('/settings', [SecuritySettingController::class, 'update'])->name('settings.update');

            Route::get('/login-attempts', [LoginAttemptController::class, 'index'])
                ->name('login-attempts');

            // Two-Factor Authentication Routes
            if (Features::enabled(Features::twoFactorAuthentication())) {
                Route::get('/two-factor-challenge', [TwoFactorAuthenticatedSessionController::class, 'create'])
                    ->middleware(['guest'])
                    ->name('two-factor.login');

                Route::post('/two-factor-challenge', [TwoFactorAuthenticatedSessionController::class, 'store'])
                    ->middleware(['guest']);
            }

            Route::get('/ip-restrictions', [IpRestrictionController::class, 'index'])
                ->name('ip-restrictions');
            Route::post('/ip-restrictions', [IpRestrictionController::class, 'store'])
                ->name('ip-restrictions.store');
            Route::delete('/ip-restrictions/{ipRestriction}', [IpRestrictionController::class, 'destroy'])
                ->name('ip-restrictions.destroy');
            Route::post('/ip-restrictions/bulk-delete', [IpRestrictionController::class, 'bulkDelete'])
                ->name('ip-restrictions.bulk-delete');

            Route::get('/sessions', [SessionController::class, 'index'])->name('sessions');
            Route::delete('/sessions/{session}', [SessionController::class, 'destroy'])->name('sessions.destroy');
            Route::post('/sessions/destroy-all', [SessionController::class, 'destroyAll'])->name('sessions.destroy-all');
            Route::get('/activity', [SessionActivityController::class, 'index'])->name('activity');
            Route::get('activity/export', [SessionActivityController::class, 'export'])
                ->name('activity.export');
        });

        Route::resource('media', MediaFileController::class);
        Route::post('media/upload', [MediaFileController::class, 'upload'])->name('media.upload');
        Route::delete('media/bulk-delete', [MediaFileController::class, 'bulkDelete'])->name('media.bulk-delete');
        Route::resource('media-collections', MediaCollectionController::class);
        Route::resource('media-categories', MediaCategoryController::class);

        // Content Management
        Route::resource('pages', PageController::class);
        Route::post('pages/{page}/restore', [PageController::class, 'restore'])->name('pages.restore');
        Route::get('pages/{page}/preview', [PageController::class, 'preview'])->name('pages.preview');
        Route::resource('page-templates', PageTemplateController::class);


        // Settings
        Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
    });
});

//Route::middleware(['auth', 'role:admin,manager'])->group(function () {
//    // Routes accessible by admins and managers
//});

// Role management routes
Route::prefix('admin/roles')->name('admin.roles.')->middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/export', [RoleController::class, 'export'])->name('export');
    Route::get('/matrix', [RoleController::class, 'matrix'])->name('matrix');
    Route::post('/clone/{role}', [RoleController::class, 'clone'])->name('clone');
    Route::post('/{role}/sync-permissions', [RoleController::class, 'syncPermissions'])->name('sync-permissions');
});


require __DIR__.'/auth.php';
