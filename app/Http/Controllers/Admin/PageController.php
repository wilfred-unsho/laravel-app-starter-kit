<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Services\PageBuilderService;
use App\Services\AdminMenuService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    protected $pageBuilder;
    protected $menuService;

    public function __construct(PageBuilderService $pageBuilder, AdminMenuService $menuService)
    {
        $this->pageBuilder = $pageBuilder;
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
        $pages = Page::with(['creator', 'editor'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Pages/Index', array_merge([
            'title' => 'Pages',
            'pages' => $pages
        ], $this->getSharedProps()));
    }

    public function create()
    {
        return Inertia::render('Admin/Pages/Builder', array_merge([
            'title' => 'Create Page',
            'blocks' => $this->pageBuilder->getAvailableBlocks()
        ], $this->getSharedProps()));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|array',
            'meta' => 'nullable|array',
            'template' => 'required|string',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date'
        ]);

        if (!$this->pageBuilder->validateBlockContent($validated['content'])) {
            return back()->withErrors(['content' => 'Invalid block content']);
        }

        $page = Page::create($validated);

        return redirect()->route('admin.pages.index')
            ->with('message', 'Page created successfully');
    }

    public function edit(Page $page)
    {
        return Inertia::render('Admin/Pages/Builder', array_merge([
            'title' => 'Edit Page',
            'page' => $page->load(['revisions' => function($query) {
                $query->latest()->take(10);
            }]),
            'blocks' => $this->pageBuilder->getAvailableBlocks()
        ], $this->getSharedProps()));
    }

    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|array',
            'meta' => 'nullable|array',
            'template' => 'required|string',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date'
        ]);

        if (!$this->pageBuilder->validateBlockContent($validated['content'])) {
            return back()->withErrors(['content' => 'Invalid block content']);
        }

        $page->update($validated);

        return back()->with('message', 'Page updated successfully');
    }

    public function restore(Page $page)
    {
        $revision = $page->revisions()->findOrFail(request('revision_id'));

        $page->update([
            'content' => $revision->content,
            'meta' => $revision->meta
        ]);

        return back()->with('message', 'Page restored to previous version');
    }

    public function preview(Page $page)
    {
        return Inertia::render('Admin/Pages/Preview', array_merge([
            'title' => 'Preview Page',
            'page' => $page
        ], $this->getSharedProps()));
    }
}
