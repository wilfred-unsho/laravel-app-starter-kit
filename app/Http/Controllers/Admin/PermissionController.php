<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::query()
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->through(fn ($permission) => [
                'id' => $permission->id,
                'name' => $permission->name,
                'slug' => $permission->slug,
                'description' => $permission->description,
                'group' => $permission->group,
            ]);

        return Inertia::render('Admin/Permissions/Index', [
            'permissions' => $permissions,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Permissions/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions',
            'description' => 'nullable|string|max:255',
            'group' => 'required|string|max:255',
        ]);

        Permission::create([
            'name' => $request->name,
            'description' => $request->description,
            'group' => $request->group,
        ]);

        return redirect()->route('admin.permissions.index')
            ->with('message', 'Permission created successfully');
    }

    public function edit(Permission $permission)
    {
        return Inertia::render('Admin/Permissions/Edit', [
            'permission' => [
                'id' => $permission->id,
                'name' => $permission->name,
                'slug' => $permission->slug,
                'description' => $permission->description,
                'group' => $permission->group,
            ],
        ]);
    }

    public function update(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
            'description' => 'nullable|string|max:255',
            'group' => 'required|string|max:255',
        ]);

        $permission->update([
            'name' => $request->name,
            'description' => $request->description,
            'group' => $request->group,
        ]);

        return redirect()->route('admin.permissions.index')
            ->with('message', 'Permission updated successfully');
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();

        return redirect()->route('admin.permissions.index')
            ->with('message', 'Permission deleted successfully');
    }
}
