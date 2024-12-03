<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RoleTemplate;
use App\Models\Permission;

class DefaultRoleTemplatesSeeder extends Seeder
{
    public function run()
    {
        $templates = [
            [
                'name' => 'Content Manager',
                'description' => 'Access to manage content, posts, and basic user operations',
                'category' => 'Content Management',
                'tags' => ['content', 'posts', 'media'],
                'permissions' => [
                    'view-content',
                    'create-content',
                    'edit-content',
                    'delete-content',
                    'view-users',
                    'view-roles',
                ],
            ],
            [
                'name' => 'User Administrator',
                'description' => 'Full access to user management and role assignments',
                'category' => 'User Management',
                'tags' => ['users', 'roles', 'permissions'],
                'permissions' => [
                    'view-users',
                    'create-users',
                    'edit-users',
                    'delete-users',
                    'view-roles',
                    'assign-roles',
                ],
            ],
            [
                'name' => 'System Administrator',
                'description' => 'Access to system settings and configurations',
                'category' => 'System Administration',
                'tags' => ['system', 'settings', 'configuration'],
                'permissions' => [
                    'view-settings',
                    'edit-settings',
                    'view-logs',
                    'manage-backups',
                    'view-users',
                    'view-roles',
                ],
            ],
            [
                'name' => 'API Manager',
                'description' => 'Manage API access and monitor API usage',
                'category' => 'API Management',
                'tags' => ['api', 'tokens', 'monitoring'],
                'permissions' => [
                    'view-api-tokens',
                    'create-api-tokens',
                    'revoke-api-tokens',
                    'view-api-logs',
                ],
            ],
            [
                'name' => 'Support Agent',
                'description' => 'Handle support tickets and basic user interactions',
                'category' => 'Support',
                'tags' => ['support', 'tickets', 'users'],
                'permissions' => [
                    'view-users',
                    'view-content',
                    'view-tickets',
                    'reply-tickets',
                    'close-tickets',
                ],
            ],
        ];

        foreach ($templates as $templateData) {
            $template = RoleTemplate::create([
                'name' => $templateData['name'],
                'description' => $templateData['description'],
                'category' => $templateData['category'],
                'tags' => $templateData['tags'],
                'is_active' => true,
            ]);

            // Get permission IDs for the template
            $permissions = Permission::whereIn('slug', $templateData['permissions'])->get();
            $template->permissions()->sync($permissions->pluck('id'));
        }
    }
}
