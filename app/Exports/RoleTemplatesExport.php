<?php

namespace App\Exports;

use App\Models\RoleTemplate;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class RoleTemplatesExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        // Explicitly load the permissions relationship
        return RoleTemplate::with(['permissions'])->get();
    }

    public function headings(): array
    {
        return [
            'Name',
            'Description',
            'Category',
            'Tags',
            'Permissions',
            'Is Active',
            'Created At',
        ];
    }

    public function map($template): array
    {
        // Check if permissions relationship exists before using pluck
        $permissions = $template->permissions ? $template->permissions->pluck('name')->implode(', ') : '';

        return [
            $template->name,
            $template->description ?? '',
            $template->category ?? '',
            is_array($template->tags) ? implode(', ', $template->tags) : '',
            $permissions,
            $template->is_active ? 'Yes' : 'No',
            $template->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
