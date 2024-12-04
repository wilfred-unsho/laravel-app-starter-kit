<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Blog Settings
    |--------------------------------------------------------------------------
    */

    // General Settings
    'name' => env('BLOG_NAME', 'My Blog'),
    'description' => env('BLOG_DESCRIPTION', 'A Laravel Blog'),
    'posts_per_page' => env('BLOG_POSTS_PER_PAGE', 10),
    'comments_per_page' => env('BLOG_COMMENTS_PER_PAGE', 20),

    // Features
    'allow_guest_comments' => env('BLOG_ALLOW_GUEST_COMMENTS', false),
    'auto_approve_comments' => env('BLOG_AUTO_APPROVE_COMMENTS', false),
    'enable_comments' => env('BLOG_ENABLE_COMMENTS', true),
    'enable_tags' => env('BLOG_ENABLE_TAGS', true),
    'enable_categories' => env('BLOG_ENABLE_CATEGORIES', true),

    // SEO
    'meta_title' => env('BLOG_META_TITLE', 'My Blog'),
    'meta_description' => env('BLOG_META_DESCRIPTION', 'A Laravel Blog'),
    'meta_keywords' => env('BLOG_META_KEYWORDS', 'laravel,blog'),

    // Social Media
    'social_sharing' => [
        'facebook' => env('BLOG_SHARE_FACEBOOK', true),
        'twitter' => env('BLOG_SHARE_TWITTER', true),
        'linkedin' => env('BLOG_SHARE_LINKEDIN', true),
    ],

    // Media
    'image_quality' => env('BLOG_IMAGE_QUALITY', 80),
    'max_image_size' => env('BLOG_MAX_IMAGE_SIZE', 2048), // KB
    'supported_image_types' => ['jpg', 'jpeg', 'png', 'gif', 'webp'],

    // Cache
    'cache_duration' => env('BLOG_CACHE_DURATION', 3600), // seconds

    // Editor
    'editor' => [
        'toolbar' => [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'imageUpload',
            'blockQuote',
            'insertTable',
            'mediaEmbed',
            'undo',
            'redo',
        ],
    ],

    // Notifications
    'notifications' => [
        'email' => [
            'new_comment' => env('BLOG_NOTIFY_NEW_COMMENT', true),
            'new_post' => env('BLOG_NOTIFY_NEW_POST', true),
        ],
    ],

    // RSS Feed
    'feed' => [
        'enable' => env('BLOG_ENABLE_FEED', true),
        'title' => env('BLOG_FEED_TITLE', 'My Blog RSS Feed'),
        'description' => env('BLOG_FEED_DESCRIPTION', 'Latest blog posts'),
    ],
];
