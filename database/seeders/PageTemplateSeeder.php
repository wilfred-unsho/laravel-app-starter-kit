<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PageTemplate;

class PageTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Default',
                'description' => 'Basic page template',
                'layout' => [
                    'header' => true,
                    'sidebar' => false,
                    'footer' => true,
                    'width' => 'contained'
                ],
                'meta_schema' => [
                    'meta_title' => ['type' => 'text', 'required' => true],
                    'meta_description' => ['type' => 'textarea', 'required' => true],
                    'meta_keywords' => ['type' => 'text', 'required' => false]
                ]
            ],
            [
                'name' => 'Landing Page',
                'description' => 'Full-width landing page template',
                'layout' => [
                    'header' => false,
                    'sidebar' => false,
                    'footer' => true,
                    'width' => 'full'
                ],
                'meta_schema' => [
                    'meta_title' => ['type' => 'text', 'required' => true],
                    'meta_description' => ['type' => 'textarea', 'required' => true],
                    'og_image' => ['type' => 'image', 'required' => true]
                ]
            ]
        ];

        foreach ($templates as $template) {
            PageTemplate::firstOrCreate(
                ['name' => $template['name']],
                $template
            );
        }
    }
}
