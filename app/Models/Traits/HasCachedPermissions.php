<?php

namespace App\Models\Traits;

use Illuminate\Support\Facades\Cache;
use App\Models\Role;
use App\Models\Permission;

trait HasCachedPermissions
{
    public function getCacheKey($type = 'permissions'): string
    {
        return "user_{$this->id}_{$type}";
    }

    public function getCachedPermissions()
    {
        return Cache::remember($this->getCacheKey(), now()->addHours(24), function () {
            return $this->getAllPermissions();
        });
    }

    public function getCachedRoles()
    {
        return Cache::remember($this->getCacheKey('roles'), now()->addHours(24), function () {
            return $this->roles;
        });
    }

    public function clearPermissionCache(): void
    {
        Cache::forget($this->getCacheKey());
        Cache::forget($this->getCacheKey('roles'));
    }

    protected static function bootHasCachedPermissions()
    {
        static::deleting(function ($model) {
            $model->clearPermissionCache();
        });

        static::saved(function ($model) {
            $model->clearPermissionCache();
        });
    }

    public function hasPermissionTo($permission): bool
    {
        if (is_string($permission)) {
            return $this->getCachedPermissions()->contains('slug', $permission);
        }

        return $this->getCachedPermissions()->contains('id', $permission->id);
    }

    public function getAllPermissions()
    {
        $permissions = $this->permissions;

        foreach ($this->roles as $role) {
            $permissions = $permissions->merge($role->getAllPermissions());
        }

        return $permissions->unique('id');
    }

    protected function invalidatePermissionCache(): void
    {
        $this->clearPermissionCache();

        // Clear cache for all users with this role
        if ($this instanceof Role) {
            $this->users->each->clearPermissionCache();
        }
    }
}
