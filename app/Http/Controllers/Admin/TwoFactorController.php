<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminMenuService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class TwoFactorController extends Controller
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

    public function show(Request $request)
    {
        return Inertia::render('Admin/Security/TwoFactor', array_merge([
            'title' => 'Two-Factor Authentication',
            'enabled' => !is_null($request->user()->two_factor_secret),
            'qrCode' => !is_null($request->user()->two_factor_secret)
                ? $request->user()->twoFactorQrCodeSvg()
                : null,
            'recoveryCodes' => !is_null($request->user()->two_factor_secret)
                ? $request->user()->recoveryCodes()
                : [],
        ], $this->getSharedProps()));
    }

    public function enable(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $request->user()->enableTwoFactorAuthentication();

        return back()->with('message', 'Two-factor authentication has been enabled.');
    }

    public function disable(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $request->user()->disableTwoFactorAuthentication();

        return back()->with('message', 'Two-factor authentication has been disabled.');
    }

    public function regenerateRecoveryCodes(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $request->user()->generateNewRecoveryCodes();

        return back()->with('message', 'Recovery codes have been regenerated.');
    }
}
