<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminMenuService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use WhichBrowser\Parser;

class SessionController extends Controller
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

    public function index()
    {
        $sessions = DB::table('sessions')
            ->where('user_id', auth()->id())
            ->orderBy('last_activity', 'desc')
            ->get()
            ->map(function ($session) {
                $parser = new Parser($session->user_agent);
                $isCurrentSession = $session->id === session()->getId();

                return [
                    'id' => $session->id,
                    'ip_address' => $session->ip_address,
                    'device_type' => $parser->device->type ?? 'Unknown',
                    'browser' => $parser->browser->name ?? 'Unknown',
                    'platform' => $parser->os->name ?? 'Unknown',
                    'last_activity' => $session->last_activity,
                    'is_current' => $isCurrentSession,
                ];
            });

        return Inertia::render('Admin/Security/Sessions', array_merge([
            'title' => 'Active Sessions',
            'sessions' => $sessions,
        ], $this->getSharedProps()));
    }

    public function destroy($sessionId)
    {
        // Don't allow destroying the current session
        if ($sessionId === session()->getId()) {
            return back()->with('error', 'Cannot terminate current session');
        }

        DB::table('sessions')
            ->where('id', $sessionId)
            ->where('user_id', auth()->id())
            ->delete();

        return back()->with('message', 'Session terminated successfully');
    }

    public function destroyAll()
    {
        // Delete all sessions except the current one
        DB::table('sessions')
            ->where('user_id', auth()->id())
            ->where('id', '!=', session()->getId())
            ->delete();

        return back()->with('message', 'All other sessions terminated successfully');
    }
}
