<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use App\Services\AdminMenuService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
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
        $roles = Role::query()
            ->withCount(['users', 'permissions'])
            ->with(['children'])
            ->whereNull('parent_id') // Get only root roles
            ->get()
            ->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'slug' => $role->slug,
                    'description' => $role->description,
                    'is_system' => $role->is_system,
                    'users_count' => $role->users_count,
                    'permissions_count' => $role->permissions_count,
                    'children' => $this->formatChildren($role->children),
                ];
            });

        return Inertia::render('Admin/Roles/Index', array_merge([
            'title' => 'Roles',
            'roles' => $roles
        ], $this->getSharedProps()));
    }

    protected function formatChildren($children)
    {
        return $children->map(function ($child) {
            return [
                'id' => $child->id,
                'name' => $child->name,
                'slug' => $child->slug,
                'description' => $child->description,
                'is_system' => $child->is_system,
                'users_count' => $child->users()->count(),
                'permissions_count' => $child->permissions()->count(),
                'children' => $this->formatChildren($child->children),
            ];
        });
    }

    public function create()
    {
        return Inertia::render('Admin/Roles/Create', array_merge([
            'title' => 'Create Role',
            'permissions' => Permission::all()->groupBy('group'),
            'availableParents' => Role::where('is_system', false)
                ->orderBy('level')
                ->get()
                ->map(fn($role) => [
                    'id' => $role->id,
                    'name' => $role->name,
                    'level' => $role->level,
                ]),
        ], $this->getSharedProps()));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles',
            'description' => 'nullable|string|max:255',
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
            'parent_id' => 'nullable|exists:roles,id',
        ]);

        $role = Role::create([
            'name' => $request->name,
            'description' => $request->description,
            'parent_id' => $request->parent_id,
        ]);

        $role->permissions()->sync($request->permissions);

        return redirect()->route('admin.roles.index')
            ->with('message', 'Role created successfully');
    }

    public function edit(Role $role)
    {
        $availableParents = Role::where('is_system', false)
            ->where('id', '!=', $role->id)
            ->whereNotIn('id', $role->getDescendants()->pluck('id'))
            ->orderBy('level')
            ->get()
            ->map(fn($role) => [
                'id' => $role->id,
                'name' => $role->name,
                'level' => $role->level,
            ]);

        return Inertia::render('Admin/Roles/Edit', array_merge([
            'title' => 'Edit Role',
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'description' => $role->description,
                'is_system' => $role->is_system,
                'parent_id' => $role->parent_id,
                'level' => $role->level,
            ],
            'permissions' => Permission::all()->groupBy('group'),
            'rolePermissions' => $role->permissions->pluck('id')->toArray(),
            'availableParents' => $availableParents,
            'inheritedPermissions' => $role->parent ? $role->parent->getAllPermissions()->pluck('id')->toArray() : [],
        ], $this->getSharedProps()));
    }

    public function update(Request $request, Role $role)
    {
        if ($role->is_system) {
            return back()->with('error', 'System roles cannot be modified.');
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'description' => 'nullable|string|max:255',
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
            'parent_id' => [
                'nullable',
                'exists:roles,id',
                function ($attribute, $value, $fail) use ($role) {
                    if ($value && $role->getDescendants()->pluck('id')->contains($value)) {
                        $fail('Cannot set a descendant role as parent.');
                    }
                },
            ],
        ]);

        $role->update([
            'name' => $request->name,
            'description' => $request->description,
            'parent_id' => $request->parent_id,
        ]);

        $role->permissions()->sync($request->permissions);

        // Update levels for all descendants
        foreach ($role->getDescendants() as $descendant) {
            $descendant->update([
                'level' => $descendant->parent->level + 1
            ]);
        }

        return redirect()->route('admin.roles.index')
            ->with('message', 'Role updated successfully');
    }

    public function destroy(Role $role)
    {
        if ($role->is_system) {
            return back()->with('error', 'System roles cannot be deleted.');
        }

        $role->delete();

        return redirect()->route('admin.roles.index')
            ->with('message', 'Role deleted successfully');
    }
}
