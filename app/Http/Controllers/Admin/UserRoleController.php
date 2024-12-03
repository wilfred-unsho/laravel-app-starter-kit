<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserRoleController extends Controller
{
    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Roles', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'userRoles' => $user->roles()->pluck('id')->toArray(),
            'availableRoles' => Role::select('id', 'name', 'description')->get(),
            'editUrl' => route('admin.users.roles.update', $user->id),
            'backUrl' => route('admin.users.index'),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'roles' => ['required', 'array'],
            'roles.*' => ['exists:roles,id']
        ]);

        $user->roles()->sync($request->roles);

        return redirect()->route('admin.users.index')
            ->with('message', 'User roles updated successfully');
    }

    public function bulkAssignment()
    {
        $users = User::with('roles')->get();
        $roles = Role::all();
        $userRoles = $users->pluck('roles', 'id');

        return Inertia::render('Admin/Users/BulkRoleAssignment', [
            'users' => $users->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]),
            'roles' => $roles,
            'userRoles' => $userRoles,
        ]);
    }

    public function bulkAssignRoles(Request $request)
    {
        $request->validate([
            'users' => ['required', 'array', 'min:1'],
            'users.*' => ['exists:users,id'],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['exists:roles,id'],
        ]);

        $users = User::whereIn('id', $request->users)->get();
        $roles = Role::whereIn('id', $request->roles)->get();

        // Check if trying to modify system roles
        if ($roles->where('is_system', true)->isNotEmpty() && !auth()->user()->hasRole('super-admin')) {
            return back()->with('error', 'You do not have permission to assign system roles.');
        }

        foreach ($users as $user) {
            // For system roles, only add new roles, don't remove existing ones
            if ($user->roles()->where('is_system', true)->exists() && !auth()->user()->hasRole('super-admin')) {
                $user->roles()->syncWithoutDetaching($request->roles);
            } else {
                $user->roles()->sync($request->roles);
            }
        }

        return redirect()->back()->with('message', 'Roles assigned successfully.');
    }
}
