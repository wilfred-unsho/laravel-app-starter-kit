<?php

namespace App\Services;

use App\Models\SessionActivity;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class SessionMonitoringService
{
    public function getActiveSessionsForUser($userId): Collection
    {
        return DB::table('sessions')
            ->where('user_id', $userId)
            ->orderBy('last_activity', 'desc')
            ->get()
            ->map(function ($session) {
                $parser = new \WhichBrowser\Parser($session->user_agent);
                return [
                    'id' => $session->id,
                    'ip_address' => $session->ip_address,
                    'last_activity' => Carbon::createFromTimestamp($session->last_activity),
                    'device_type' => $parser->device->type ?? 'Unknown',
                    'browser' => $parser->browser->name ?? 'Unknown',
                    'platform' => $parser->os->name ?? 'Unknown',
                    'is_current' => $session->id === session()->getId(),
                ];
            });
    }

    public function getSessionActivityForUser($userId, $limit = 20): Collection
    {
        return SessionActivity::where('user_id', $userId)
            ->with('user')
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getSessionStatistics($userId): array
    {
        $activities = SessionActivity::where('user_id', $userId)
            ->where('created_at', '>=', now()->subDays(30))
            ->get();

        return [
            'total_sessions' => $activities->where('action', 'login')->count(),
            'total_timeouts' => $activities->where('action', 'timeout')->count(),
            'forced_logouts' => $activities->where('action', 'forced_logout')->count(),
            'devices' => $activities->pluck('device_type')->unique()->count(),
            'browsers' => $activities->pluck('browser')->unique()->values(),
            'platforms' => $activities->pluck('platform')->unique()->values(),
            'most_used_device' => $activities->groupBy('device_type')
                ->map->count()
                ->sortDesc()
                ->keys()
                ->first(),
        ];
    }

    public function forceLogoutSession($sessionId)
    {
        DB::table('sessions')
            ->where('id', $sessionId)
            ->delete();

        SessionActivity::log('forced_logout', $sessionId);
    }

    public function forceLogoutAllOtherSessions($userId)
    {
        $currentSessionId = session()->getId();

        DB::table('sessions')
            ->where('user_id', $userId)
            ->where('id', '!=', $currentSessionId)
            ->get()
            ->each(function ($session) {
                $this->forceLogoutSession($session->id);
            });
    }

    public function logSessionEvent($action)
    {
        return SessionActivity::log($action);
    }

    public function getUnusualActivities($userId): Collection
    {
        $commonIps = SessionActivity::where('user_id', $userId)
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('ip_address')
            ->havingRaw('COUNT(*) > 5')
            ->pluck('ip_address');

        return SessionActivity::where('user_id', $userId)
            ->where('created_at', '>=', now()->subDays(30))
            ->whereNotIn('ip_address', $commonIps)
            ->orWhere(function ($query) {
                $query->where('action', 'forced_logout')
                    ->orWhere('action', 'timeout');
            })
            ->latest()
            ->get();
    }
}
