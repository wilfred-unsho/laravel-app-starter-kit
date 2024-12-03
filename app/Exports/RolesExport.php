<?php

namespace App\Exports;

use App\Models\Role;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class RolesExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Role::with(['permissions', 'users', 'parent'])->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Slug',
            'Description',
            'Parent Role',
            'Level',
            'Is System',
            'Users Count',
            'Direct Permissions',
            'Inherited Permissions',
            'Created At',
            'Updated At',
        ];
    }

    public function map($role): array
    {
        return [
            $role->id,
            $role->name,
            $role->slug,
            $role->description,
            $role->parent ? $role->parent->name : 'None',
            $role->level,
            $role->is_system ? 'Yes' : 'No',
            $role->users->count(),
            $role->permissions->pluck('name')->join(', '),
            $role->parent ? $role->parent->permissions->pluck('name')->join(', ') : '',
            $role->created_at->format('Y-m-d H:i:s'),
            $role->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
