<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Role extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_system',
        'parent_id',
        'level',
    ];

    protected $casts = [
        'is_system' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($role) {
            if (empty($role->slug)) {
                $role->slug = Str::slug($role->name);
            }

            // Set hierarchy level based on parent
            if ($role->parent_id) {
                $parent = static::find($role->parent_id);
                $role->level = $parent ? $parent->level + 1 : 0;
            } else {
                $role->level = 0;
            }
        });
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

//    public function hasPermission($permission)
//    {
//        if (is_string($permission)) {
//            return $this->permissions->contains('slug', $permission);
//        }
//        return $this->permissions->contains($permission);
//    }

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

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Role::class, 'parent_id');
    }

    public function getAllPermissions()
    {
        $allPermissions = $this->permissions;

        if ($this->parent) {
            $allPermissions = $allPermissions->merge($this->parent->getAllPermissions());
        }

        return $allPermissions->unique('id');
    }

    public function hasPermission($permission)
    {
        if (is_string($permission)) {
            return $this->getAllPermissions()->contains('slug', $permission);
        }
        return $this->getAllPermissions()->contains($permission);
    }

    public function getAncestors()
    {
        $ancestors = collect();
        $role = $this;

        while ($role->parent) {
            $ancestors->push($role->parent);
            $role = $role->parent;
        }

        return $ancestors;
    }

    public function getDescendants()
    {
        $descendants = collect();

        foreach ($this->children as $child) {
            $descendants->push($child);
            $descendants = $descendants->merge($child->getDescendants());
        }

        return $descendants;
    }

    public function isParentOf($role): bool
    {
        return $this->children->contains($role);
    }

    public function isChildOf($role): bool
    {
        return $this->parent && $this->parent->is($role);
    }

    public function isAncestorOf($role): bool
    {
        return $this->getDescendants()->contains($role);
    }

    public function isDescendantOf($role): bool
    {
        return $this->getAncestors()->contains($role);
    }
}
