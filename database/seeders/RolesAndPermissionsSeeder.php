<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Support\Str;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Create roles
        $roles = [
            [
                'name' => 'Super Administrator',
                'slug' => 'super-admin',
                'description' => 'Full system access with all permissions',
                'is_system' => true,
            ],
            [
                'name' => 'Administrator',
                'slug' => 'admin',
                'description' => 'System administrator with limited system permissions',
                'is_system' => true,
            ],
            [
                'name' => 'Manager',
                'slug' => 'manager',
                'description' => 'Manages users and content',
                'is_system' => false,
            ],
            [
                'name' => 'User',
                'slug' => 'user',
                'description' => 'Regular user with basic access',
                'is_system' => true,
            ],
        ];

        $createdRoles = collect();
        foreach ($roles as $roleData) {
            $createdRoles->push(Role::create($roleData));
        }

        // Create permissions by group
        $permissionGroups = [
            'user-management' => [
                'view-users' => 'View user list and details',
                'create-users' => 'Create new users',
                'edit-users' => 'Edit existing users',
                'delete-users' => 'Delete users',
                'impersonate-users' => 'Impersonate other users',
                'export-users' => 'Export user data',
            ],
            'role-management' => [
                'view-roles' => 'View role list and details',
                'create-roles' => 'Create new roles',
                'edit-roles' => 'Edit existing roles',
                'delete-roles' => 'Delete roles',
                'assign-roles' => 'Assign roles to users',
            ],
            'permission-management' => [
                'view-permissions' => 'View permission list',
                'create-permissions' => 'Create new permissions',
                'edit-permissions' => 'Edit existing permissions',
                'delete-permissions' => 'Delete permissions',
                'assign-permissions' => 'Assign permissions to roles',
            ],
            'system-settings' => [
                'view-settings' => 'View system settings',
                'edit-settings' => 'Modify system settings',
                'manage-backups' => 'Manage system backups',
                'view-logs' => 'View system logs',
                'manage-maintenance' => 'Manage maintenance mode',
            ],
            'content-management' => [
                'view-content' => 'View content',
                'create-content' => 'Create new content',
                'edit-content' => 'Edit existing content',
                'delete-content' => 'Delete content',
                'publish-content' => 'Publish or unpublish content',
                'manage-categories' => 'Manage content categories',
            ],
            'api-management' => [
                'view-api-tokens' => 'View API tokens',
                'create-api-tokens' => 'Create API tokens',
                'revoke-api-tokens' => 'Revoke API tokens',
                'view-api-logs' => 'View API request logs',
            ],
        ];

        $createdPermissions = collect();
        foreach ($permissionGroups as $group => $permissions) {
            foreach ($permissions as $slug => $description) {
                $createdPermissions->push(Permission::create([
                    'name' => ucwords(str_replace('-', ' ', $slug)),
                    'slug' => $slug,
                    'description' => $description,
                    'group' => $group,
                ]));
            }
        }

        // Assign permissions to roles
        $superAdmin = $createdRoles->firstWhere('slug', 'super-admin');
        $admin = $createdRoles->firstWhere('slug', 'admin');
        $manager = $createdRoles->firstWhere('slug', 'manager');
        $user = $createdRoles->firstWhere('slug', 'user');

        // Super Admin gets all permissions
        $superAdmin->permissions()->sync($createdPermissions->pluck('id'));

        // Admin gets all except system critical permissions
        $adminPermissions = $createdPermissions->reject(function ($permission) {
            return in_array($permission->slug, [
                'manage-backups',
                'manage-maintenance',
                'create-permissions',
                'edit-permissions',
                'delete-permissions',
            ]);
        });
        $admin->permissions()->sync($adminPermissions->pluck('id'));

        // Manager gets user and content management permissions
        $managerPermissions = $createdPermissions->filter(function ($permission) {
            return in_array($permission->group, ['user-management', 'content-management']) &&
                !in_array($permission->slug, ['delete-users', 'impersonate-users']);
        });
        $manager->permissions()->sync($managerPermissions->pluck('id'));

        // Regular users get basic view permissions
        $userPermissions = $createdPermissions->filter(function ($permission) {
            return Str::startsWith($permission->slug, 'view-');
        });
        $user->permissions()->sync($userPermissions->pluck('id'));

        // Assign super-admin role to the first user if exists
        if ($firstUser = User::first()) {
            $firstUser->roles()->sync([$superAdmin->id]);
        }
    }
}
