<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Console\Command;

class ManageRolePermissions extends Command
{
    protected $signature = 'roles:permissions
                          {action : The action to perform (list|sync|grant|revoke)}
                          {--role= : The role slug}
                          {--permission= : The permission slug}';

    protected $description = 'Manage role permissions';

    public function handle()
    {
        $action = $this->argument('action');

        switch ($action) {
            case 'list':
                $this->listPermissions();
                break;
            case 'sync':
                $this->syncPermissions();
                break;
            case 'grant':
                $this->grantPermission();
                break;
            case 'revoke':
                $this->revokePermission();
                break;
            default:
                $this->error("Invalid action: {$action}");
                return 1;
        }

        return 0;
    }

    protected function listPermissions()
    {
        $roleSlug = $this->option('role');

        if (!$roleSlug) {
            $roles = Role::with('permissions')->get();
            foreach ($roles as $role) {
                $this->info("\nRole: {$role->name}");
                $this->listRolePermissions($role);
            }
            return;
        }

        $role = Role::where('slug', $roleSlug)->first();
        if (!$role) {
            $this->error("Role not found: {$roleSlug}");
            return;
        }

        $this->listRolePermissions($role);
    }

    protected function listRolePermissions(Role $role)
    {
        $headers = ['ID', 'Name', 'Slug', 'Group'];
        $permissions = $role->permissions->map(function ($permission) {
            return [
                $permission->id,
                $permission->name,
                $permission->slug,
                $permission->group,
            ];
        });

        $this->table($headers, $permissions);
    }

    protected function syncPermissions()
    {
        $roleSlug = $this->option('role');
        if (!$roleSlug) {
            $this->error('Role is required for sync action');
            return;
        }

        $role = Role::where('slug', $roleSlug)->first();
        if (!$role) {
            $this->error("Role not found: {$roleSlug}");
            return;
        }

        // Get permissions by group
        $permissions = Permission::all()->groupBy('group');
        $selectedPermissions = [];

        foreach ($permissions as $group => $groupPermissions) {
            $this->info("\nPermissions for group: {$group}");
            $headers = ['ID', 'Name', 'Current'];
            $rows = $groupPermissions->map(function ($permission) use ($role) {
                return [
                    $permission->id,
                    $permission->name,
                    $role->hasPermission($permission) ? 'Yes' : 'No'
                ];
            });

            $this->table($headers, $rows);

            if ($this->confirm("Would you like to modify permissions for the {$group} group?")) {
                $selected = $this->choice(
                    'Select permissions (comma-separated)',
                    $groupPermissions->pluck('name', 'id')->toArray(),
                    null,
                    null,
                    true
                );

                $selectedPermissions = array_merge(
                    $selectedPermissions,
                    array_intersect(
                        $groupPermissions->pluck('id')->toArray(),
                        array_map('trim', $selected)
                    )
                );
            }
        }

        $role->permissions()->sync($selectedPermissions);
        $role->clearPermissionCache();
        $this->info('Permissions synchronized successfully!');
    }

    protected function grantPermission()
    {
        $roleSlug = $this->option('role');
        $permissionSlug = $this->option('permission');

        if (!$roleSlug || !$permissionSlug) {
            $this->error('Both role and permission are required for grant action');
            return;
        }

        $role = Role::where('slug', $roleSlug)->first();
        if (!$role) {
            $this->error("Role not found: {$roleSlug}");
            return;
        }

        $permission = Permission::where('slug', $permissionSlug)->first();
        if (!$permission) {
            $this->error("Permission not found: {$permissionSlug}");
            return;
        }

        $role->givePermissionTo($permission);
        $this->info("Permission '{$permission->name}' granted to role '{$role->name}'");
    }

    protected function revokePermission()
    {
        $roleSlug = $this->option('role');
        $permissionSlug = $this->option('permission');

        if (!$roleSlug || !$permissionSlug) {
            $this->error('Both role and permission are required for revoke action');
            return;
        }

        $role = Role::where('slug', $roleSlug)->first();
        if (!$role) {
            $this->error("Role not found: {$roleSlug}");
            return;
        }

        $permission = Permission::where('slug', $permissionSlug)->first();
        if (!$permission) {
            $this->error("Permission not found: {$permissionSlug}");
            return;
        }

        $role->revokePermissionTo($permission);
        $this->info("Permission '{$permission->name}' revoked from role '{$role->name}'");
    }
}
