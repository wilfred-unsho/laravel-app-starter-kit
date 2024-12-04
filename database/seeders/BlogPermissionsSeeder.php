<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class BlogPermissionsSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            // Blog Management
            [
                'name' => 'manage-blog',
                'description' => 'Can manage all blog functionality',
                'group' => 'blog'
            ],
            [
                'name' => 'view-blog-analytics',
                'description' => 'Can view blog analytics',
                'group' => 'blog'
            ],
            [
                'name' => 'manage-posts',
                'description' => 'Can manage blog posts',
                'group' => 'blog'
            ],
            [
                'name' => 'manage-categories',
                'description' => 'Can manage blog categories',
                'group' => 'blog'
            ],
            [
                'name' => 'manage-tags',
                'description' => 'Can manage blog tags',
                'group' => 'blog'
            ],
            [
                'name' => 'manage-comments',
                'description' => 'Can manage blog comments',
                'group' => 'blog'
            ],
            [
                'name' => 'publish-posts',
                'description' => 'Can publish blog posts',
                'group' => 'blog'
            ],
            [
                'name' => 'delete-posts',
                'description' => 'Can delete blog posts',
                'group' => 'blog'
            ],
            [
                'name' => 'moderate-comments',
                'description' => 'Can moderate blog comments',
                'group' => 'blog'
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission['name']], $permission);
        }
    }
}
