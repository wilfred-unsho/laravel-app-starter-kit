<?php

namespace App\Http\Controllers\Admin\Blog;

use App\Http\Controllers\Controller;
use App\Models\Blog\{Post, Comment, Category, Tag};
use App\Services\AdminMenuService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    protected $menuService;

    public function __construct(AdminMenuService $menuService)
    {
        $this->menuService = $menuService;
    }

    public function index(Request $request)
    {
        $dateRange = $request->get('range', '30');
        $startDate = now()->subDays($dateRange);

        $stats = [
            'general' => $this->getGeneralStats(),
            'views' => $this->getViewsStats($startDate),
            'popular_posts' => $this->getPopularPosts($startDate),
            'engagement' => $this->getEngagementStats($startDate),
            'category_distribution' => $this->getCategoryDistribution(),
            'author_stats' => $this->getAuthorStats($startDate),
            'traffic_sources' => $this->getTrafficSources($startDate),
        ];

        return Inertia::render('Admin/Blog/Analytics/Index', array_merge([
            'title' => 'Blog Analytics',
            'stats' => $stats,
            'dateRange' => $dateRange,
        ], $this->getSharedProps()));
    }

    protected function getGeneralStats()
    {
        return [
            'total_posts' => Post::count(),
            'published_posts' => Post::published()->count(),
            'draft_posts' => Post::draft()->count(),
            'total_comments' => Comment::count(),
            'pending_comments' => Comment::pending()->count(),
            'total_categories' => Category::count(),
            'total_tags' => Tag::count(),
        ];
    }

    protected function getViewsStats($startDate)
    {
        return DB::table('blog_post_views')
            ->select(
                DB::raw('DATE(viewed_at) as date'),
                DB::raw('COUNT(*) as views')
            )
            ->where('viewed_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($record) {
                return [
                    'date' => $record->date,
                    'views' => $record->views
                ];
            });
    }

    protected function getPopularPosts($startDate)
    {
        return Post::select('posts.*')
            ->addSelect(DB::raw('COUNT(blog_post_views.id) as view_count'))
            ->leftJoin('blog_post_views', 'posts.id', '=', 'blog_post_views.post_id')
            ->where('blog_post_views.viewed_at', '>=', $startDate)
            ->groupBy('posts.id')
            ->orderByDesc('view_count')
            ->limit(5)
            ->with(['author', 'categories'])
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'author' => $post->author->name,
                    'views' => $post->view_count,
                    'comments' => $post->comments()->count(),
                    'categories' => $post->categories->pluck('name')
                ];
            });
    }

    protected function getEngagementStats($startDate)
    {
        $comments = Comment::where('created_at', '>=', $startDate)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $avgCommentsPerPost = Post::published()
            ->where('published_at', '>=', $startDate)
            ->withCount('comments')
            ->get()
            ->avg('comments_count');

        return [
            'comments_timeline' => $comments,
            'avg_comments_per_post' => round($avgCommentsPerPost, 2),
            'total_comments_period' => $comments->sum('count')
        ];
    }

    protected function getCategoryDistribution()
    {
        return Category::withCount('posts')
            ->having('posts_count', '>', 0)
            ->orderByDesc('posts_count')
            ->get()
            ->map(function ($category) {
                return [
                    'name' => $category->name,
                    'count' => $category->posts_count
                ];
            });
    }

    protected function getAuthorStats($startDate)
    {
        return Post::where('published_at', '>=', $startDate)
            ->select('users.name as author')
            ->selectRaw('COUNT(posts.id) as post_count')
            ->selectRaw('SUM((SELECT COUNT(*) FROM blog_post_views WHERE post_id = posts.id)) as total_views')
            ->selectRaw('AVG((SELECT COUNT(*) FROM blog_comments WHERE post_id = posts.id)) as avg_comments')
            ->join('users', 'posts.author_id', '=', 'users.id')
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('total_views')
            ->get()
            ->map(function ($stat) {
                return [
                    'author' => $stat->author,
                    'posts' => $stat->post_count,
                    'views' => $stat->total_views,
                    'avg_comments' => round($stat->avg_comments, 1)
                ];
            });
    }

    protected function getTrafficSources($startDate)
    {
        // This would require additional tracking implementation
        // Placeholder for demonstration
        return [
            ['source' => 'Direct', 'visits' => 1200],
            ['source' => 'Search', 'visits' => 850],
            ['source' => 'Social', 'visits' => 650],
            ['source' => 'Referral', 'visits' => 300],
        ];
    }
}
