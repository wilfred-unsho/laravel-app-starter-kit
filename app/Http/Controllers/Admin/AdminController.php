<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminMenuService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
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
        return Inertia::render('Admin/Dashboard', array_merge([
            'title' => 'Dashboard',
            'stats' => [
                'users' => [
                    'total' => 100,
                    'new' => 10,
                    'active' => 85
                ],
                'posts' => [
                    'total' => 250,
                    'published' => 200,
                    'draft' => 50
                ],
                // Add more stats as needed
            ],
        ], $this->getSharedProps()));
    }

    public function settings()
    {
        return Inertia::render('Admin/Settings', array_merge([
            'title' => 'Settings',
            'settings' => [
                // Add your settings data here
            ],
        ], $this->getSharedProps()));
    }
}
