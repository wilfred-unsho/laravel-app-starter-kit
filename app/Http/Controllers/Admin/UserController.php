<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AdminMenuService;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    protected $menuService;
    protected $activityLogService;

    public function __construct(AdminMenuService $menuService, ActivityLogService $activityLogService)
    {
        $this->menuService = $menuService;
        $this->activityLogService = $activityLogService;
    }

    protected function getSharedProps()
    {
        return [
            'menu_items' => $this->menuService->getVisibleMenuItems(),
        ];
    }

    public function index()
    {
        $users = User::query()
            ->when(request('search'), function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_active' => $user->is_active,
            ]);

        return Inertia::render('Admin/Users/Index', array_merge([
            'users' => $users,
            'filters' => request()->only(['search']),
            'can' => [
                'create_users' => auth()->user()->can('create-users'),
                'edit_users' => auth()->user()->can('edit-users'),
                'delete_users' => auth()->user()->can('delete-users'),
            ],
        ], $this->getSharedProps()));
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create', array_merge([
            'title' => 'Create User'
        ], $this->getSharedProps()));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => 'required|string|in:admin,user',
            'is_active' => 'boolean',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_active' => $request->is_active ?? true,
        ]);

        $this->activityLogService->logUserAction(
            action: 'created',
            user: $user,
            description: "User created by " . auth()->user()->name,
            properties: ['role' => $request->role]
        );

        return redirect()->route('admin.users.index')
            ->with('message', 'User created successfully');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', array_merge([
            'title' => 'Edit User',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_active' => $user->is_active,
            ],
        ], $this->getSharedProps()));
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => $request->password ? ['confirmed', Password::defaults()] : '',
            'role' => 'required|string|in:admin,user',
            'is_active' => 'boolean',
        ]);

        $changes = array_diff_assoc($request->only(['name', 'email', 'role', 'is_active']), $user->only(['name', 'email', 'role', 'is_active']));

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'is_active' => $request->is_active ?? true,
        ]);

        if ($request->password) {
            $user->update([
                'password' => Hash::make($request->password),
            ]);
            $changes['password'] = 'changed';
        }

        $this->activityLogService->logUserAction(
            action: 'updated',
            user: $user,
            description: "User updated by " . auth()->user()->name,
            properties: ['changes' => $changes]
        );

        return redirect()->route('admin.users.index')
            ->with('message', 'User updated successfully');
    }

    public function destroy(User $user)
    {
        $this->activityLogService->logUserAction(
            action: 'deleted',
            user: $user,
            description: "User deleted by " . auth()->user()->name
        );

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('message', 'User deleted successfully');
    }

    public function bulkAction(Request $request)
    {
        $request->validate([
            'users' => 'required|array',
            'users.*' => 'exists:users,id',
            'action' => 'required|in:activate,deactivate,delete'
        ]);

        $users = User::whereIn('id', $request->users);
        $userIds = $users->pluck('id')->toArray();

        switch ($request->action) {
            case 'activate':
                $users->update(['is_active' => true]);
                $message = 'Users activated successfully';
                break;
            case 'deactivate':
                $users->update(['is_active' => false]);
                $message = 'Users deactivated successfully';
                break;
            case 'delete':
                $users->delete();
                $message = 'Users deleted successfully';
                break;
        }

        $this->activityLogService->log(
            action: "bulk_{$request->action}",
            description: "Bulk {$request->action} performed on users by " . auth()->user()->name,
            properties: ['user_ids' => $userIds]
        );

        return back()->with('message', $message);
    }

    public function activityLog(User $user)
    {
        return Inertia::render('Admin/Users/ActivityLog', array_merge([
            'title' => 'User Activity Log',
            'user' => $user->only('id', 'name', 'email'),
            'activities' => $this->activityLogService->getActivityForUser($user->id),
        ], $this->getSharedProps()));
    }
}
