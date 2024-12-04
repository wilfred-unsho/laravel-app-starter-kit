<?php

namespace App\Http\Controllers\Admin\Blog;

use App\Http\Controllers\Controller;
use App\Models\Blog\Post;
use App\Models\Blog\Category;
use App\Models\Blog\Tag;
use App\Services\AdminMenuService;
use App\Services\BlogNotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PostController extends Controller
{
    protected $menuService;
    protected $notificationService;

    public function __construct(AdminMenuService $menuService, BlogNotificationService $notificationService)
    {
        $this->menuService = $menuService;
        $this->notificationService = $notificationService;
    }

    protected function getSharedProps()
    {
        return [
            'menu_items' => $this->menuService->getVisibleMenuItems(),
        ];
    }

    public function index()
    {
        $posts = Post::with(['author', 'categories', 'tags'])
            ->withCount(['comments', 'views'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Blog/Posts/Index', array_merge([
            'title' => 'Blog Posts',
            'posts' => $posts
        ], $this->getSharedProps()));
    }

    public function create()
    {
        return Inertia::render('Admin/Blog/Posts/Create', array_merge([
            'title' => 'Create Post',
            'categories' => Category::all(),
            'tags' => Tag::all()
        ], $this->getSharedProps()));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'status' => 'required|in:draft,published,scheduled',
            'published_at' => 'nullable|date',
            'categories' => 'array',
            'tags' => 'array',
            'meta' => 'nullable|array',
            'is_featured' => 'boolean',
            'allow_comments' => 'boolean'
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['author_id'] = auth()->id();

        $post = Post::create($validated);

        if ($post->status === 'published') {
            $this->notificationService->notifyNewPost($post);
        }

        if (!empty($validated['categories'])) {
            $post->categories()->sync($validated['categories']);
        }

        if (!empty($validated['tags'])) {
            $post->tags()->sync($validated['tags']);
        }

        return redirect()->route('admin.blog.posts.edit', $post)
            ->with('success', 'Post created successfully');
    }

    public function edit(Post $post)
    {
        $post->load(['categories', 'tags', 'revisions']);

        return Inertia::render('Admin/Blog/Posts/Edit', array_merge([
            'title' => 'Edit Post',
            'post' => $post,
            'categories' => Category::all(),
            'tags' => Tag::all()
        ], $this->getSharedProps()));
    }

    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'status' => 'required|in:draft,published,scheduled',
            'published_at' => 'nullable|date',
            'categories' => 'array',
            'tags' => 'array',
            'meta' => 'nullable|array',
            'is_featured' => 'boolean',
            'allow_comments' => 'boolean'
        ]);

        $changes = array_diff_assoc($validated, $post->toArray());
        $wasPublished = $post->status === 'published';

        $post->update($validated);

        if (!empty($validated['categories'])) {
            $post->categories()->sync($validated['categories']);
        }

        if (!empty($validated['tags'])) {
            $post->tags()->sync($validated['tags']);
        }

        // Notify subscribers of significant changes
        if (!empty($changes)) {
            if ($wasPublished) {
                $this->notificationService->notifyPostUpdate($post, $changes);
            } elseif ($post->status === 'published') {
                $this->notificationService->notifyNewPost($post);
            }
        }

        return back()->with('success', 'Post updated successfully');
    }

    public function destroy(Post $post)
    {
        $post->delete();
        return redirect()->route('admin.blog.posts.index')
            ->with('success', 'Post deleted successfully');
    }

    public function restore(Request $request, Post $post)
    {
        $revision = $post->revisions()->findOrFail($request->revision_id);

        $post->update([
            'content' => $revision->content,
            'meta' => $revision->meta
        ]);

        return back()->with('success', 'Post restored to previous version');
    }
}
