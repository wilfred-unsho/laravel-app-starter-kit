<?php

namespace App\Services;

class PageBuilderService
{
    public function getAvailableBlocks(): array
    {
        return [
            'text' => [
                'name' => 'Text Block',
                'icon' => 'Type',
                'component' => 'TextBlock',
                'settings' => ['content', 'alignment', 'size']
            ],
            'image' => [
                'name' => 'Image',
                'icon' => 'Image',
                'component' => 'ImageBlock',
                'settings' => ['src', 'alt', 'caption', 'size']
            ],
            'video' => [
                'name' => 'Video',
                'icon' => 'Video',
                'component' => 'VideoBlock',
                'settings' => ['url', 'autoplay', 'controls']
            ],
            'columns' => [
                'name' => 'Columns',
                'icon' => 'Columns',
                'component' => 'ColumnsBlock',
                'settings' => ['columns', 'gap']
            ]
        ];
    }

    public function validateBlockContent(array $content): bool
    {
        // Implement validation logic
        return true;
    }
}
