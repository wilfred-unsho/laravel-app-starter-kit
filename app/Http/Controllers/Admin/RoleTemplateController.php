<?php

namespace App\Http\Controllers\Admin;

use App\Exports\RoleTemplatesExport;
use App\Http\Controllers\Controller;
use App\Imports\RoleTemplatesImport;
use App\Models\RoleTemplate;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class RoleTemplateController extends Controller
{
    public function index()
    {
        $templates = RoleTemplate::query()
            ->with('permissions')
            ->withCount('permissions')
            ->get()
            ->map(fn($template) => [
                'id' => $template->id,
                'name' => $template->name,
                'description' => $template->description,
                'category' => $template->category,
                'tags' => $template->tags,
                'permissions_count' => $template->permissions_count,
                'is_active' => $template->is_active,
            ]);

        $categories = RoleTemplate::distinct('category')
            ->whereNotNull('category')
            ->pluck('category');

        // Get popular tags
        $popularTags = RoleTemplate::whereNotNull('tags')
            ->get()
            ->flatMap(fn($template) => $template->tags ?? [])
            ->countBy()
            ->filter(fn($count) => $count > 1)
            ->keys()
            ->values()
            ->all();

        return Inertia::render('Admin/Roles/Templates/Index', [
            'templates' => $templates,
            'categories' => $categories,
            'popularTags' => $popularTags
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Roles/Templates/Create', [
            'permissions' => Permission::all()->groupBy('group'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:role_templates',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:50',
            'tags' => 'nullable|array',
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
            'is_active' => 'boolean',
        ]);

        $template = RoleTemplate::create([
            'name' => $request->name,
            'description' => $request->description,
            'category' => $request->category,
            'tags' => $request->tags,
            'is_active' => $request->is_active,
        ]);

        $template->permissions()->sync($request->permissions);

        return redirect()->route('admin.roles.templates.index')
            ->with('message', 'Template created successfully');
    }

    public function edit(RoleTemplate $template)
    {
        return Inertia::render('Admin/Roles/Templates/Edit', [
            'template' => [
                'id' => $template->id,
                'name' => $template->name,
                'description' => $template->description,
                'category' => $template->category,
                'tags' => $template->tags,
                'permissions' => $template->permissions->pluck('id'),
                'is_active' => $template->is_active,
            ],
            'permissions' => Permission::all()->groupBy('group'),
            'categories' => RoleTemplate::distinct('category')->pluck('category'),
            'availableTags' => RoleTemplate::whereNotNull('tags')
                ->get()
                ->flatMap(fn($t) => $t->tags ?? [])
                ->unique()
                ->values()
                ->all(),
        ]);
    }

    public function update(Request $request, RoleTemplate $template)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:role_templates,name,' . $template->id,
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:50',
            'tags' => 'nullable|array',
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
            'is_active' => 'boolean',
        ]);

        $template->update([
            'name' => $request->name,
            'description' => $request->description,
            'category' => $request->category,
            'tags' => $request->tags,
            'is_active' => $request->is_active,
        ]);

        $template->permissions()->sync($request->permissions);

        return redirect()->route('admin.roles.templates.index')
            ->with('message', 'Template updated successfully');
    }

    public function destroy(RoleTemplate $template)
    {
        $template->delete();

        return redirect()->route('admin.roles.templates.index')
            ->with('message', 'Template deleted successfully');
    }

    public function export()
    {
        try {
            $filename = 'role-templates-' . now()->format('Y-m-d-His') . '.xlsx';

            return Excel::download(
                new RoleTemplatesExport(),
                $filename,
                \Maatwebsite\Excel\Excel::XLSX,
                [
                    'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition' => 'attachment; filename="' . $filename . '"'
                ]
            );
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Export failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        try {
            Excel::import(new RoleTemplatesImport, $request->file('file'));

            return redirect()->route('admin.roles.templates.index')
                ->with('message', 'Templates imported successfully');
        } catch (\Exception $e) {
            return redirect()->route('admin.roles.templates.index')
                ->with('error', 'Error importing templates: ' . $e->getMessage());
        }
    }

    public function createRole(RoleTemplate $template)
    {
        try {
            $role = $template->createRole();

            return redirect()->route('admin.roles.edit', $role->id)
                ->with('message', 'Role created successfully from template');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to create role from template: ' . $e->getMessage());
        }
    }

    public function compareVersions(RoleTemplate $template, Request $request)
    {
        $request->validate([
            'version1' => 'required|string',
            'version2' => 'required|string',
        ]);

        $comparison = $template->compareVersions(
            $request->version1,
            $request->version2
        );

        $versions = $template->versions()
            ->orderBy('version', 'desc')
            ->pluck('version');

        return Inertia::render('Admin/Roles/Templates/Compare', [
            'template' => [
                'id' => $template->id,
                'name' => $template->name,
                'current_version' => $template->version,
                'versions' => $versions,
            ],
            'comparison' => $comparison,
            'versions' => [
                'old' => $request->version1,
                'new' => $request->version2,
            ],
        ]);
    }


    public function versions(RoleTemplate $template)
    {
        $versions = $template->versions()
            ->with('permissions')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($version) => [
                'id' => $version->id,
                'version' => $version->version,
                'changelog' => $version->changelog,
                'created_at' => $version->created_at,
                'permissions_count' => $version->permissions->count(),
            ]);

        return response()->json([
            'versions' => $versions,
            'current_version' => $template->version,
        ]);
    }

    public function createVersion(Request $request, RoleTemplate $template)
    {
        $request->validate([
            'changelog' => 'required|string|max:500',
        ]);

        $newVersion = $template->createVersion($request->changelog);

        return redirect()->back()->with('message', "Version {$newVersion} created successfully");
    }

    public function revertToVersion(Request $request, RoleTemplate $template)
    {
        $request->validate([
            'version' => 'required|string',
        ]);

        $template->revertToVersion($request->version);

        return redirect()->back()->with('message', "Reverted to version {$request->version} successfully");
    }

    public function duplicate(Request $request, RoleTemplate $template)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:role_templates,name',
            'includeHistory' => 'required|boolean',
        ]);

        try {
            \DB::beginTransaction();

            // Create new template
            $newTemplate = RoleTemplate::create([
                'name' => $request->name,
                'description' => $template->description,
                'category' => $template->category,
                'tags' => $template->tags,
                'is_active' => true,
                'version' => '1.0',
            ]);

            // Copy permissions
            $newTemplate->permissions()->sync($template->permissions->pluck('id'));

            // Copy version history if requested
            if ($request->includeHistory) {
                foreach ($template->versions()->orderBy('created_at')->get() as $version) {
                    $newTemplate->versions()->create([
                        'version' => $version->version,
                        'data' => $version->data,
                        'changelog' => $version->changelog,
                        'created_at' => $version->created_at,
                    ]);
                }
            }

            \DB::commit();

            return redirect()->route('admin.roles.templates.edit', $newTemplate->id)
                ->with('message', 'Template duplicated successfully');
        } catch (\Exception $e) {
            \DB::rollBack();
            return redirect()->back()->with('error', 'Failed to duplicate template: ' . $e->getMessage());
        }
    }

    /**
     * Batch delete versions
     */
    public function batchDeleteVersions(Request $request, RoleTemplate $template)
    {
        $request->validate([
            'versions' => 'required|array',
            'versions.*' => 'exists:role_template_versions,id'
        ]);

        try {
            // Don't allow deleting the current version
            $currentVersionId = $template->versions()
                ->where('version', $template->version)
                ->first()->id;

            if (in_array($currentVersionId, $request->versions)) {
                return response()->json([
                    'message' => 'Cannot delete the current version'
                ], 422);
            }

            // Delete versions
            $template->versions()
                ->whereIn('id', $request->versions)
                ->delete();

            return response()->json([
                'message' => 'Versions deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete versions: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Batch archive versions
     */
    public function batchArchiveVersions(Request $request, RoleTemplate $template)
    {
        $request->validate([
            'versions' => 'required|array',
            'versions.*' => 'exists:role_template_versions,id',
            'reason' => 'nullable|string|max:255'
        ]);

        try {
            // Don't allow archiving the current version
            $currentVersionId = $template->versions()
                ->where('version', $template->version)
                ->first()->id;

            if (in_array($currentVersionId, $request->versions)) {
                return response()->json([
                    'message' => 'Cannot archive the current version'
                ], 422);
            }

            // Archive versions
            $template->versions()
                ->whereIn('id', $request->versions)
                ->update([
                    'is_archived' => true,
                    'archived_at' => now(),
                    'archive_reason' => $request->reason
                ]);

            return response()->json([
                'message' => 'Versions archived successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to archive versions: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Unarchive a version
     */
    public function unarchiveVersion(Request $request, RoleTemplate $template, $versionId)
    {
        try {
            $version = $template->versions()->findOrFail($versionId);

            $version->update([
                'is_archived' => false,
                'archived_at' => null,
                'archive_reason' => null
            ]);

            return response()->json([
                'message' => 'Version unarchived successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to unarchive version: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get archived versions
     */
    public function getArchivedVersions(RoleTemplate $template)
    {
        $archivedVersions = $template->versions()
            ->where('is_archived', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($version) => [
                'id' => $version->id,
                'version' => $version->version,
                'changelog' => $version->changelog,
                'archived_at' => $version->archived_at,
                'archive_reason' => $version->archive_reason,
                'created_at' => $version->created_at
            ]);

        return response()->json([
            'versions' => $archivedVersions
        ]);
    }

}
