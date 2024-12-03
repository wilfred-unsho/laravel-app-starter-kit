<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LoginAttempt;
use App\Models\IpRestriction;
use App\Services\AdminMenuService;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SecurityController extends Controller
{
    protected $menuService;

    public function __construct(AdminMenuService $menuService)
    {
        $this->menuService = $menuService;
    }

    protected function getSharedProps()
    {
        return [
            'menu_items' => $this->menuService->getVisibleMenuItems(),
        ];
    }

    public function dashboard()
    {
        // Get recent login attempts
        $recentAttempts = LoginAttempt::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($attempt) {
                return [
                    'id' => $attempt->id,
                    'email' => $attempt->email,
                    'ip_address' => $attempt->ip_address,
                    'was_successful' => $attempt->was_successful,
                    'browser' => $attempt->browser,
                    'platform' => $attempt->platform,
                    'created_at' => $attempt->created_at,
                ];
            });

        // Get active sessions count
        $activeSessions = DB::table('sessions')
            ->where('last_activity', '>=', now()->subMinutes(config('session.lifetime'))->getTimestamp())
            ->count();

        // Get IP restrictions stats
        $ipRestrictions = [
            'blacklisted' => IpRestriction::where('type', 'blacklist')
                ->where(function ($query) {
                    $query->whereNull('expires_at')
                        ->orWhere('expires_at', '>', now());
                })->count(),
            'whitelisted' => IpRestriction::where('type', 'whitelist')
                ->where(function ($query) {
                    $query->whereNull('expires_at')
                        ->orWhere('expires_at', '>', now());
                })->count(),
        ];

        // Get 2FA stats
        $twoFactorStats = [
            'enabled' => DB::table('users')
                ->whereNotNull('two_factor_secret')
                ->count(),
            'total_users' => DB::table('users')->count(),
        ];

        return Inertia::render('Admin/Security/Dashboard', array_merge([
            'title' => 'Security Dashboard',
            'stats' => [
                'recent_attempts' => $recentAttempts,
                'active_sessions' => $activeSessions,
                'ip_restrictions' => $ipRestrictions,
                'two_factor' => $twoFactorStats,
            ],
        ], $this->getSharedProps()));
    }
}
