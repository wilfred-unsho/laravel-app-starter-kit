<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MediaCategory;

class MediaCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Documents',
                'description' => 'PDFs, documents, and text files'
            ],
            [
                'name' => 'Images',
                'description' => 'Photography, illustrations, and graphics'
            ],
            [
                'name' => 'Videos',
                'description' => 'Video content and animations'
            ],
            [
                'name' => 'Audio',
                'description' => 'Music, podcasts, and sound effects'
            ],
            [
                'name' => 'Marketing',
                'description' => 'Marketing materials and assets'
            ],
            [
                'name' => 'Templates',
                'description' => 'Reusable design templates'
            ]
        ];

        foreach ($categories as $category) {
            MediaCategory::create($category);
        }
    }
}
