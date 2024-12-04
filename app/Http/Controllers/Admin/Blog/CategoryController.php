<?php

namespace App\Http\Controllers\Admin\Blog;

use App\Http\Controllers\Controller;
use App\Models\Blog\Category;
use App\Services\AdminMenuService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoryController extends Controller
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
        $categories = Category::withCount('posts')
            ->with('parent')
            ->orderBy('order')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'description' => $category->description,
                    'parent' => $category->parent ? [
                        'id' => $category->parent->id,
                        'name' => $category->parent->name
                    ] : null,
                    'posts_count' => $category->posts_count,
                    'order' => $category->order
                ];
            });

        return Inertia::render('Admin/Blog/Categories/Index', array_merge([
            'title' => 'Blog Categories',
            'categories' => $categories
        ], $this->getSharedProps()));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:blog_categories,id',
            'order' => 'integer'
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        Category::create($validated);

        return back()->with('success', 'Category created successfully');
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => [
                'nullable',
                'exists:blog_categories,id',
                function ($attribute, $value) use ($category) {
                    if ($value == $category->id) {
                        return false;
                    }
                }
            ],
            'order' => 'integer'
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $category->update($validated);

        return back()->with('success', 'Category updated successfully');
    }

    public function destroy(Category $category)
    {
        if ($category->posts()->exists()) {
            return back()->withErrors(['message' => 'Cannot delete category with associated posts']);
        }

        $category->delete();

        return back()->with('success', 'Category deleted successfully');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:blog_categories,id',
            'categories.*.order' => 'required|integer'
        ]);

        foreach ($request->categories as $categoryData) {
            Category::where('id', $categoryData['id'])
                ->update(['order' => $categoryData['order']]);
        }

        return back()->with('success', 'Categories reordered successfully');
    }
}
