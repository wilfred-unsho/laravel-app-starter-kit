<?php

namespace App\Http\Controllers\Blog;

use App\Http\Controllers\Controller;
use App\Models\Blog\{Post, Category, Tag};
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::published()
            ->with(['author', 'categories', 'tags'])
            ->withCount(['comments' => function($query) {
                $query->approved();
            }]);

        // Apply filters
        if ($request->category) {
            $query->whereHas('categories', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->tag) {
            $query->whereHas('tags', function($q) use ($request) {
                $q->where('slug', $request->tag);
            });
        }

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                    ->orWhere('content', 'like', "%{$request->search}%");
            });
        }

        $posts = $query->latest('published_at')
            ->paginate(12)
            ->through(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'featured_image' => $post->featured_image,
                    'reading_time' => $post->reading_time,
                    'published_at' => $post->published_at,
                    'comments_count' => $post->comments_count,
                    'author' => [
                        'name' => $post->author->name,
                        'avatar' => $post->author->profile_photo_url,
                    ],
                    'categories' => $post->categories->map(fn($cat) => [
                        'name' => $cat->name,
                        'slug' => $cat->slug,
                    ]),
                ];
            });

        // Get sidebar data
        $categories = Category::withCount('posts')
            ->having('posts_count', '>', 0)
            ->orderBy('name')
            ->get();

        $popularTags = Tag::withCount('posts')
            ->having('posts_count', '>', 0)
            ->orderByDesc('posts_count')
            ->limit(15)
            ->get();

        $featuredPosts = Post::published()
            ->where('is_featured', true)
            ->latest('published_at')
            ->limit(3)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'featured_image' => $post->featured_image,
                ];
            });

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'tags' => $popularTags,
            'featuredPosts' => $featuredPosts,
            'filters' => $request->only(['category', 'tag', 'search']),
        ]);
    }

    public function show($slug)
    {
        $post = Post::where('slug', $slug)
            ->published()
            ->with(['author', 'categories', 'tags'])
            ->withCount(['comments' => function($query) {
                $query->approved();
            }])
            ->firstOrFail();

        // Track view
        if (!session()->has("post-{$post->id}-viewed")) {
            $post->views()->create([
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'user_id' => auth()->id(),
                'viewed_at' => now(),
            ]);
            session()->put("post-{$post->id}-viewed", true);
        }

        // Get related posts
        $relatedPosts = Post::published()
            ->where('id', '!=', $post->id)
            ->whereHas('categories', function($query) use ($post) {
                $query->whereIn('id', $post->categories->pluck('id'));
            })
            ->latest()
            ->limit(3)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'featured_image' => $post->featured_image,
                ];
            });

        // Get comments
        $comments = $post->comments()
            ->with(['user', 'replies.user'])
            ->approved()
            ->root()
            ->latest()
            ->get();

        return Inertia::render('Blog/Show', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'content' => $post->content,
                'featured_image' => $post->featured_image,
                'reading_time' => $post->reading_time,
                'published_at' => $post->published_at,
                'comments_count' => $post->comments_count,
                'author' => [
                    'name' => $post->author->name,
                    'bio' => $post->author->bio,
                    'avatar' => $post->author->profile_photo_url,
                ],
                'categories' => $post->categories,
                'tags' => $post->tags,
                'meta' => $post->meta,
            ],
            'comments' => $comments,
            'relatedPosts' => $relatedPosts,
            'canComment' => auth()->check() || config('blog.allow_guest_comments'),
        ]);
    }
}
