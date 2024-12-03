<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AdminMenuService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserProfileController extends Controller
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

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'avatar' => 'nullable|image|max:1024',
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string|max:500',
            'job_title' => 'nullable|string|max:100',
            'department' => 'nullable|string|max:100',
            'location' => 'nullable|string|max:100',
            'timezone' => 'required|string|timezone',
            'notification_preferences' => 'nullable|array',
            'theme_preferences' => 'nullable|array',
        ]);

        $updateData = $request->only([
            'phone',
            'bio',
            'job_title',
            'department',
            'location',
            'timezone',
            'notification_preferences',
            'theme_preferences',
        ]);

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            try {
                // Delete old avatar if exists
                if ($user->profile && $user->profile->avatar) {
                    Storage::disk('public')->delete($user->profile->avatar);
                }

                // Store new avatar
                $path = $request->file('avatar')->store('avatars', 'public');
                $updateData['avatar'] = $path;

            } catch (\Exception $e) {
                return redirect()
                    ->back()
                    ->withErrors(['avatar' => 'Failed to upload image. Please try again.'])
                    ->withInput();
            }
        }

        // Ensure profile exists
        if (!$user->profile) {
            $user->profile()->create($updateData);
        } else {
            $user->profile()->update($updateData);
        }

        return redirect()
            ->back()
            ->with('message', 'Profile updated successfully');
    }

    public function show(User $user)
    {
        return Inertia::render('Admin/Users/Profile/Show', array_merge([
            'title' => 'User Profile',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
            ],
            'profile' => [
                'avatar' => $user->profile?->avatar,
                'phone' => $user->profile?->phone,
                'bio' => $user->profile?->bio,
                'job_title' => $user->profile?->job_title,
                'department' => $user->profile?->department,
                'location' => $user->profile?->location,
                'timezone' => $user->profile?->timezone ?? 'UTC',
                'notification_preferences' => $user->profile?->notification_preferences ?? [
                        'email' => true,
                        'browser' => true
                    ],
                'theme_preferences' => $user->profile?->theme_preferences ?? [
                        'darkMode' => false,
                        'compactMode' => false
                    ],
            ],
        ], $this->getSharedProps()));
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Profile/Edit', array_merge([
            'title' => 'Edit Profile',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'profile' => [
                'avatar' => $user->profile?->avatar
                    ? Storage::url($user->profile->avatar)
                    : null,
                'phone' => $user->profile?->phone,
                'bio' => $user->profile?->bio,
                'job_title' => $user->profile?->job_title,
                'department' => $user->profile?->department,
                'location' => $user->profile?->location,
                'timezone' => $user->profile?->timezone ?? 'UTC',
                'notification_preferences' => $user->profile?->notification_preferences ?? [
                        'email' => true,
                        'browser' => true
                    ],
                'theme_preferences' => $user->profile?->theme_preferences ?? [
                        'darkMode' => false,
                        'compactMode' => false
                    ],
            ],
            'timezones' => \DateTimeZone::listIdentifiers(),
        ], $this->getSharedProps()));
    }
}
