<?php

namespace App\Services;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RoleService
{
    public function createRole(array $data): Role
    {
        return DB::transaction(function () use ($data) {
            $role = Role::create([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'parent_id' => $data['parent_id'] ?? null,
                'is_system' => $data['is_system'] ?? false,
            ]);

            if (isset($data['permissions'])) {
                $role->permissions()->sync($data['permissions']);
            }

            return $role;
        });
    }

    public function updateRole(Role $role, array $data): Role
    {
        return DB::transaction(function () use ($role, $data) {
            $role->update([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'parent_id' => $data['parent_id'] ?? null,
            ]);

            if (isset($data['permissions'])) {
                $role->permissions()->sync($data['permissions']);
            }

            return $role->fresh();
        });
    }

    public function deleteRole(Role $role): bool
    {
        if ($role->is_system) {
            throw new \Exception('System roles cannot be deleted.');
        }

        return DB::transaction(function () use ($role) {
            // Move children to parent if exists
            if ($role->parent_id) {
                $role->children()->update(['parent_id' => $role->parent_id]);
            } else {
                // Move children to root level
                $role->children()->update(['parent_id' => null]);
            }

            return $role->delete();
        });
    }

    public function cloneRole(Role $role, string $newName): Role
    {
        return DB::transaction(function () use ($role, $newName) {
            $clone = Role::create([
                'name' => $newName,
                'description' => $role->description . ' (Clone)',
                'parent_id' => $role->parent_id,
                'is_system' => false,
            ]);

            $clone->permissions()->sync($role->permissions->pluck('id'));

            return $clone;
        });
    }

    public function getRoleHierarchy(): Collection
    {
        return Role::with(['children', 'permissions'])
            ->whereNull('parent_id')
            ->get()
            ->map(function ($role) {
                return $this->formatRoleForHierarchy($role);
            });
    }

    protected function formatRoleForHierarchy(Role $role): array
    {
        $formattedRole = [
            'id' => $role->id,
            'name' => $role->name,
            'slug' => $role->slug,
            'description' => $role->description,
            'is_system' => $role->is_system,
            'level' => $role->level,
            'permissions_count' => $role->permissions->count(),
            'users_count' => $role->users()->count(),
        ];

        if ($role->children->isNotEmpty()) {
            $formattedRole['children'] = $role->children->map(function ($child) {
                return $this->formatRoleForHierarchy($child);
            })->values()->all();
        }

        return $formattedRole;
    }

    public function validateHierarchy(Role $role, ?int $newParentId): bool
    {
        if (!$newParentId) {
            return true;
        }

        // Can't set a role as its own parent
        if ($role->id === $newParentId) {
            return false;
        }

        // Can't set a descendant as parent
        $descendantIds = $role->getDescendants()->pluck('id')->toArray();
        if (in_array($newParentId, $descendantIds)) {
            return false;
        }

        return true;
    }

    public function getPermissionMatrix(): Collection
    {
        return Role::with('permissions')->get()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => Permission::all()->map(function ($permission) use ($role) {
                    return [
                        'id' => $permission->id,
                        'name' => $permission->name,
                        'has_permission' => $role->hasPermission($permission),
                        'inherited' => $role->parent && $role->parent->hasPermission($permission),
                    ];
                }),
            ];
        });
    }
}
