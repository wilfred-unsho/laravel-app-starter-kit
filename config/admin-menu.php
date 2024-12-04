<?php

return [
    [
        'title' => 'Dashboard',
        'icon' => 'LayoutDashboard',
        'route' => 'admin.dashboard',
        'permission' => 'view-dashboard'
    ],
    [
        'title' => 'User Management',
        'icon' => 'Users',
        'permission' => 'view-users',
        'submenu' => [
            [
                'title' => 'All Users',
                'route' => 'admin.users.index',
                'permission' => 'view-users'
            ],
            [
                'title' => 'Add User',
                'route' => 'admin.users.create',
                'permission' => 'create-users'
            ],
            [
                'title' => 'Role Management',
                'route' => 'admin.roles.index',
                'permission' => 'manage-roles'
            ]
        ]
    ],
    [
        'title' => 'Media',
        'icon' => 'Image',
        'permission' => 'manage-media',
        'submenu' => [
            [
                'title' => 'Media Manager',
                'route' => 'admin.media.index',
                'permission' => 'manage-media'
            ],
            [
                'title' => 'Categories',
                'route' => 'admin.media-categories.index',
                'permission' => 'manage-media'
            ]
        ]
    ],
    [
        'title' => 'Content',
        'icon' => 'FileText',
        'permission' => 'manage-content',
        'submenu' => [
            [
                'title' => 'Pages',
                'route' => 'admin.pages.index',
                'permission' => 'manage-pages'
            ],
            [
                'title' => 'Templates',
                'route' => 'admin.page-templates.index',
                'permission' => 'manage-templates'
            ]
        ]
    ],
    [
        'title' => 'Blog',
        'icon' => 'BookOpen',
        'permission' => 'manage-blog',
        'submenu' => [
            [
                'title' => 'Dashboard',
                'route' => 'admin.blog.analytics',
                'permission' => 'view-blog-analytics'
            ],
            [
                'title' => 'Posts',
                'route' => 'admin.blog.posts.index',
                'permission' => 'manage-posts'
            ],
            [
                'title' => 'Categories',
                'route' => 'admin.blog.categories.index',
                'permission' => 'manage-categories'
            ],
            [
                'title' => 'Tags',
                'route' => 'admin.blog.tags.index',
                'permission' => 'manage-tags'
            ],
            [
                'title' => 'Comments',
                'route' => 'admin.blog.comments.index',
                'permission' => 'manage-comments'
            ]
        ]
    ],
    [
        'title' => 'Security',
        'icon' => 'Shield',
        'permission' => 'manage-security',
        'submenu' => [
            [
                'title' => 'Overview',
                'route' => 'admin.security.dashboard',
                'permission' => 'manage-security'
            ],
            [
                'title' => 'IP Restrictions',
                'route' => 'admin.security.ip-restrictions',
                'permission' => 'manage-security'
            ],
            [
                'title' => 'Active Sessions',
                'route' => 'admin.security.sessions',
                'permission' => 'manage-security'
            ],
            [
                'title' => 'Session Activity',
                'route' => 'admin.security.activity',
                'permission' => 'manage-security'
            ],
            [
                'title' => 'Login Activity',
                'route' => 'admin.security.login-attempts',
                'permission' => 'manage-security'
            ],
            [
                'title' => 'Two-Factor Auth',
                'route' => 'admin.security.2fa',
                'permission' => 'manage-security'
            ],
            [
                'title' => 'Settings',
                'route' => 'admin.security.settings',
                'permission' => 'manage-security'
            ],
        ]
    ],
    [
        'title' => 'Settings',
        'icon' => 'Settings',
        'route' => 'admin.settings',
        'permission' => 'manage-settings'
    ],
];
