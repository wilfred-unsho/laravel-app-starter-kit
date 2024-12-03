<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageTemplate;
use App\Services\AdminMenuService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageTemplateController extends Controller
{
    protected $menuService;

    public function __construct(AdminMenuService $menuService)
    {
        $this->menuService = $menuService;
    }

    protected function getSharedProps()
    {
        return [
            'menu_items' => $this->menuService->getVisibleMenuItems(),
        ];
    }

    public function index()
    {
        $templates = PageTemplate::latest()->get();

        return Inertia::render('Admin/Pages/Templates/Index', array_merge([
            'title' => 'Page Templates',
            'templates' => $templates
        ], $this->getSharedProps()));
    }

    public function create()
    {
        return Inertia::render('Admin/Pages/Templates/Create', array_merge([
            'title' => 'Create Template'
        ], $this->getSharedProps()));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:page_templates',
            'description' => 'nullable|string',
            'layout' => 'required|array',
            'meta_schema' => 'nullable|array'
        ]);

        PageTemplate::create($validated);

        return redirect()->route('admin.page-templates.index')
            ->with('message', 'Template created successfully');
    }

    public function edit(PageTemplate $pageTemplate)
    {
        return Inertia::render('Admin/Pages/Templates/Edit', array_merge([
            'title' => 'Edit Template',
            'template' => $pageTemplate
        ], $this->getSharedProps()));
    }

    public function update(Request $request, PageTemplate $pageTemplate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:page_templates,name,' . $pageTemplate->id,
            'description' => 'nullable|string',
            'layout' => 'required|array',
            'meta_schema' => 'nullable|array'
        ]);

        $pageTemplate->update($validated);

        return redirect()->route('admin.page-templates.index')
            ->with('message', 'Template updated successfully');
    }

    public function destroy(PageTemplate $pageTemplate)
    {
        if ($pageTemplate->pages()->exists()) {
            return back()->with('error', 'Cannot delete template that is in use');
        }

        $pageTemplate->delete();

        return redirect()->route('admin.page-templates.index')
            ->with('message', 'Template deleted successfully');
    }
}
