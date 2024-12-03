<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder;

class RoleTemplate extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'category',
        'tags',
        'permissions',
        'is_active',
        'metadata'
    ];

    protected $casts = [
        'permissions' => 'array',
        'tags' => 'array',
        'metadata' => 'array',
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($template) {
            if (empty($template->slug)) {
                $template->slug = Str::slug($template->name);
            }
        });
    }

    public function createRole(): Role
    {
        $role = Role::create([
            'name' => $this->name,
            'description' => $this->description,
            'is_system' => false,
        ]);

        if (!empty($this->permissions)) {
            $permissions = Permission::whereIn('id', $this->permissions)->get();
            // Sync permissions from the template to the new role
            $role->permissions()->sync($this->permissions->pluck('id'));
        }

        return $role;
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_template_permissions');
    }

    public function compareWithRole(Role $role): array
    {
        $templatePermissions = Permission::whereIn('id', $this->permissions)->pluck('id')->toArray();
        $rolePermissions = $role->permissions->pluck('id')->toArray();

        $added = array_diff($templatePermissions, $rolePermissions);
        $removed = array_diff($rolePermissions, $templatePermissions);
        $common = array_intersect($templatePermissions, $rolePermissions);

        return [
            'added' => Permission::whereIn('id', $added)->get(),
            'removed' => Permission::whereIn('id', $removed)->get(),
            'common' => Permission::whereIn('id', $common)->get(),
        ];
    }

    public function scopeCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    public function scopeHasTag(Builder $query, string $tag): Builder
    {
        return $query->whereJsonContains('tags', $tag);
    }

    public function previewData(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'permissions' => Permission::whereIn('id', $this->permissions)
                ->get()
                ->groupBy('group'),
        ];
    }

    public function versions()
    {
        return $this->hasMany(RoleTemplateVersion::class);
    }

    public function createVersion($changelog = null)
    {
        // Increment version
        $currentVersion = $this->version;
        $versionParts = explode('.', $currentVersion);
        $versionParts[count($versionParts) - 1]++;
        $newVersion = implode('.', $versionParts);

        // Store current state as a version
        $this->versions()->create([
            'version' => $newVersion,
            'data' => [
                'name' => $this->name,
                'description' => $this->description,
                'category' => $this->category,
                'tags' => $this->tags,
                'permissions' => $this->permissions->pluck('id')->toArray(),
                'is_active' => $this->is_active,
            ],
            'changelog' => $changelog,
        ]);

        // Update template version
        $this->version = $newVersion;
        $this->latest_version = $newVersion;
        $this->save();

        return $newVersion;
    }

    public function revertToVersion($version)
    {
        $templateVersion = $this->versions()->where('version', $version)->firstOrFail();
        $data = $templateVersion->data;

        // Update template with version data
        $this->update([
            'name' => $data['name'],
            'description' => $data['description'],
            'category' => $data['category'],
            'tags' => $data['tags'],
            'is_active' => $data['is_active'],
            'version' => $version,
        ]);

        // Sync permissions
        $this->permissions()->sync($data['permissions']);

        return $this;
    }

    public function compareVersions($version1, $version2)
    {
        $v1 = $this->versions()->where('version', $version1)->firstOrFail();
        $v2 = $this->versions()->where('version', $version2)->firstOrFail();

        return [
            'name' => [
                'changed' => $v1->data['name'] !== $v2->data['name'],
                'old' => $v1->data['name'],
                'new' => $v2->data['name'],
            ],
            'description' => [
                'changed' => $v1->data['description'] !== $v2->data['description'],
                'old' => $v1->data['description'],
                'new' => $v2->data['description'],
            ],
            'permissions' => [
                'added' => array_diff($v2->data['permissions'], $v1->data['permissions']),
                'removed' => array_diff($v1->data['permissions'], $v2->data['permissions']),
            ],
            'category' => [
                'changed' => $v1->data['category'] !== $v2->data['category'],
                'old' => $v1->data['category'],
                'new' => $v2->data['category'],
            ],
            'tags' => [
                'added' => array_diff($v2->data['tags'] ?? [], $v1->data['tags'] ?? []),
                'removed' => array_diff($v1->data['tags'] ?? [], $v2->data['tags'] ?? []),
            ],
        ];
    }
}
