<?php

namespace App\Imports;

use App\Models\RoleTemplate;
use App\Models\Permission;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Str;

class RoleTemplatesImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Parse permissions from comma-separated string
        $permissionNames = array_map('trim', explode(',', $row['permissions'] ?? ''));
        $permissions = Permission::whereIn('name', $permissionNames)->pluck('id')->toArray();

        // Parse tags
        $tags = array_map('trim', explode(',', $row['tags'] ?? ''));
        $tags = array_filter($tags);

        $template = RoleTemplate::create([
            'name' => $row['name'],
            'description' => $row['description'] ?? null,
            'category' => $row['category'] ?? null,
            'tags' => !empty($tags) ? $tags : null,
            'is_active' => strtolower($row['is_active'] ?? 'yes') === 'yes',
            'version' => $row['version'] ?? '1.0',
        ]);

        // Sync permissions
        $template->permissions()->sync($permissions);

        return $template;
    }
}
