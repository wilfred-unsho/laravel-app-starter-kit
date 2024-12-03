<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\SecuritySetting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;

class SessionTimeout
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            if (Auth::check()) {
                // Set default values if security settings don't exist yet
                $inactivityTimeout = (int)config('session.lifetime', 120);  // Cast to integer
                $maxSessions = 5;

                try {
                    if (Schema::hasTable('security_settings')) {
                        // Ensure we get integers
                        $inactivityTimeout = (int)SecuritySetting::get('session_inactivity_timeout', $inactivityTimeout);
                        $maxSessions = (int)SecuritySetting::get('max_sessions_per_user', $maxSessions);
                    }
                } catch (\Exception $e) {
                    report($e);
                }

                $lastActivity = session('last_activity');

                // Update last activity timestamp
                session(['last_activity' => time()]);

                // Only check timeout if we have a last activity timestamp
                if ($lastActivity) {
                    $timeout = Carbon::createFromTimestamp((int)$lastActivity)
                        ->addMinutes($inactivityTimeout);

                    if ($timeout->isPast()) {
                        Auth::logout();
                        $request->session()->invalidate();
                        $request->session()->regenerateToken();

                        if ($request->wantsJson()) {
                            return response()->json([
                                'message' => 'Session expired due to inactivity.'
                            ], 401);
                        }

                        return redirect()->route('login')
                            ->with('message', 'Your session has expired due to inactivity.');
                    }
                }
            }
        } catch (\Exception $e) {
            report($e);
        }

        return $next($request);
    }
}
