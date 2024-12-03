<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminMenuService;
use App\Services\SessionMonitoringService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SessionActivityController extends Controller
{
    protected $menuService;
    protected $sessionService;

    public function __construct(
        AdminMenuService $menuService,
        SessionMonitoringService $sessionService
    ) {
        $this->menuService = $menuService;
        $this->sessionService = $sessionService;
    }

    protected function getSharedProps()
    {
        return [
            'menu_items' => $this->menuService->getVisibleMenuItems(),
        ];
    }

    public function index(Request $request)
    {
        $userId = auth()->id();
        $activities = $this->sessionService->getSessionActivityForUser($userId);
        $statistics = $this->sessionService->getSessionStatistics($userId);
        $unusualActivities = $this->sessionService->getUnusualActivities($userId);

        return Inertia::render('Admin/Security/SessionActivity', array_merge([
            'title' => 'Session Activity',
            'activities' => $activities,
            'statistics' => $statistics,
            'unusualActivities' => $unusualActivities,
        ], $this->getSharedProps()));
    }

    public function export(): StreamedResponse
    {
        $activities = $this->sessionService->getSessionActivityForUser(auth()->id());

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="session-activity-' . date('Y-m-d') . '.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function() use ($activities) {
            $file = fopen('php://output', 'w');

            // Add CSV headers
            fputcsv($file, [
                'Date',
                'Action',
                'IP Address',
                'Device Type',
                'Browser',
                'Platform',
                'Session ID'
            ]);

            // Add data rows
            foreach ($activities as $activity) {
                fputcsv($file, [
                    $activity->created_at->format('Y-m-d H:i:s'),
                    $activity->action,
                    $activity->ip_address,
                    $activity->device_type,
                    $activity->browser,
                    $activity->platform,
                    $activity->session_id
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
