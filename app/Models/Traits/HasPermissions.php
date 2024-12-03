<?php

namespace App\Models\Traits;

use App\Models\Permission;
use App\Models\Role;

trait HasPermissions
{
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class);
    }

    public function hasRole($role)
    {
        if (is_string($role)) {
            return $this->roles->contains('slug', $role);
        }
        return $this->roles->contains($role);
    }

    public function hasPermission($permission)
    {
        // Check direct permissions
        if (is_string($permission)) {
            if ($this->permissions->contains('slug', $permission)) {
                return true;
            }
        } elseif ($this->permissions->contains($permission)) {
            return true;
        }

        // Check permissions through roles
        return $this->roles->some(function ($role) use ($permission) {
            if (is_string($permission)) {
                return $role->permissions->contains('slug', $permission);
            }
            return $role->permissions->contains($permission);
        });
    }

    public function assignRole($role)
    {
        if (is_string($role)) {
            $role = Role::where('slug', $role)->firstOrFail();
        }
        $this->roles()->syncWithoutDetaching($role);
        return $this;
    }

    public function removeRole($role)
    {
        if (is_string($role)) {
            $role = Role::where('slug', $role)->firstOrFail();
        }
        $this->roles()->detach($role);
        return $this;
    }

    public function syncRoles($roles)
    {
        if (is_string($roles)) {
            $roles = [$roles];
        }

        $roleIds = collect($roles)->map(function ($role) {
            if (is_string($role)) {
                return Role::where('slug', $role)->firstOrFail()->id;
            }
            return $role->id;
        });

        $this->roles()->sync($roleIds);
        return $this;
    }

    public function givePermissionTo($permission)
    {
        if (is_string($permission)) {
            $permission = Permission::where('slug', $permission)->firstOrFail();
        }
        $this->permissions()->syncWithoutDetaching($permission);
        return $this;
    }

    public function revokePermissionTo($permission)
    {
        if (is_string($permission)) {
            $permission = Permission::where('slug', $permission)->firstOrFail();
        }
        $this->permissions()->detach($permission);
        return $this;
    }
}
