<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LoginAttempt;
use App\Services\AdminMenuService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoginAttemptController extends Controller
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

    public function index(Request $request)
    {
        $query = LoginAttempt::with('user')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('email', 'like', "%{$search}%")
                        ->orWhere('ip_address', 'like', "%{$search}%")
                        ->orWhere('browser', 'like', "%{$search}%")
                        ->orWhere('platform', 'like', "%{$search}%");
                });
            })
            ->when($request->status, function ($query, $status) {
                if ($status === 'success') {
                    $query->where('was_successful', true);
                } elseif ($status === 'failed') {
                    $query->where('was_successful', false);
                }
            })
            ->latest();

        $attempts = $query->paginate(15)
            ->through(fn ($attempt) => [
                'id' => $attempt->id,
                'email' => $attempt->email,
                'user' => $attempt->user ? [
                    'id' => $attempt->user->id,
                    'name' => $attempt->user->name,
                ] : null,
                'ip_address' => $attempt->ip_address,
                'browser' => $attempt->browser,
                'platform' => $attempt->platform,
                'device' => $attempt->device,
                'was_successful' => $attempt->was_successful,
                'failure_reason' => $attempt->failure_reason,
                'created_at' => $attempt->created_at,
            ]);

        return Inertia::render('Admin/Security/LoginAttempts', array_merge([
            'title' => 'Login Attempts',
            'attempts' => $attempts,
            'filters' => $request->only(['search', 'status']),
        ], $this->getSharedProps()));
    }
}
