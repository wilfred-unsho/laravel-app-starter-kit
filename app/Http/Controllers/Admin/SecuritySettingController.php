<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SecuritySetting;
use App\Services\AdminMenuService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SecuritySettingController extends Controller
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

    public function edit()
    {
        $settings = SecuritySetting::all()
            ->mapWithKeys(function ($setting) {
                return [$setting->key => [
                    'value' => $setting->value,
                    'group' => $setting->group,
                    'type' => $setting->type,
                    'description' => $setting->description,
                ]];
            });

        return Inertia::render('Admin/Security/Settings', array_merge([
            'title' => 'Security Settings',
            'settings' => $settings,
        ], $this->getSharedProps()));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'session_lifetime' => 'required|integer|min:1',
            'session_inactivity_timeout' => 'required|integer|min:1',
            'max_sessions_per_user' => 'required|integer|min:1',
            'force_logout_after_password_change' => 'required|boolean',
        ]);

        foreach ($validated as $key => $value) {
            SecuritySetting::set($key, $value);
        }

        return back()->with('message', 'Settings updated successfully');
    }
}
