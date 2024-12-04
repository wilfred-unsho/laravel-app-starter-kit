<?php

namespace App\Http\Controllers\Admin\Blog;

use App\Http\Controllers\Controller;
use App\Models\Blog\Tag;
use App\Services\AdminMenuService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class TagController extends Controller
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
        $tags = Tag::withCount('posts')
            ->latest()
            ->get()
            ->map(function ($tag) {
                return [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'slug' => $tag->slug,
                    'description' => $tag->description,
                    'posts_count' => $tag->posts_count
                ];
            });

        return Inertia::render('Admin/Blog/Tags/Index', array_merge([
            'title' => 'Blog Tags',
            'tags' => $tags
        ], $this->getSharedProps()));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:blog_tags',
            'description' => 'nullable|string'
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        Tag::create($validated);

        return back()->with('success', 'Tag created successfully');
    }

    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:blog_tags,name,' . $tag->id,
            'description' => 'nullable|string'
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $tag->update($validated);

        return back()->with('success', 'Tag updated successfully');
    }

    public function destroy(Tag $tag)
    {
        if ($tag->posts()->exists()) {
            return back()->withErrors(['message' => 'Cannot delete tag with associated posts']);
        }

        $tag->delete();

        return back()->with('success', 'Tag deleted successfully');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'tags' => 'required|array',
            'tags.*' => 'exists:blog_tags,id'
        ]);

        $tagsWithPosts = Tag::whereIn('id', $request->tags)
            ->whereHas('posts')
            ->exists();

        if ($tagsWithPosts) {
            return back()->withErrors(['message' => 'Some tags have associated posts and cannot be deleted']);
        }

        Tag::whereIn('id', $request->tags)->delete();

        return back()->with('success', 'Tags deleted successfully');
    }
}
