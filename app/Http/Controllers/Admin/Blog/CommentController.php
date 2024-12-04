<?php

namespace App\Http\Controllers\Admin\Blog;

use App\Http\Controllers\Controller;
use App\Models\Blog\Comment;
use App\Services\AdminMenuService;
use App\Notifications\Blog\CommentApproved;
use App\Notifications\Blog\CommentRejected;
use App\Services\BlogNotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommentController extends Controller
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

    public function index(Request $request)
    {
        $query = Comment::with(['post', 'user', 'parent'])
            ->when($request->status, function ($query, $status) {
                return $query->where('is_approved', $status === 'approved');
            })
            ->when($request->search, function ($query, $search) {
                return $query->where(function ($query) use ($search) {
                    $query->where('content', 'like', "%{$search}%")
                        ->orWhere('author_name', 'like', "%{$search}%")
                        ->orWhere('author_email', 'like', "%{$search}%")
                        ->orWhereHas('post', function ($query) use ($search) {
                            $query->where('title', 'like', "%{$search}%");
                        });
                });
            });

        $comments = $query->latest()->paginate(20)->through(function ($comment) {
            return [
                'id' => $comment->id,
                'content' => $comment->content,
                'author_name' => $comment->author_name ?? $comment->user?->name,
                'author_email' => $comment->author_email ?? $comment->user?->email,
                'is_approved' => $comment->is_approved,
                'created_at' => $comment->created_at,
                'post' => [
                    'id' => $comment->post->id,
                    'title' => $comment->post->title,
                ],
                'parent' => $comment->parent ? [
                    'id' => $comment->parent->id,
                    'content' => $comment->parent->content,
                    'author_name' => $comment->parent->author_name ?? $comment->parent->user?->name,
                ] : null,
            ];
        });

        return Inertia::render('Admin/Blog/Comments/Index', array_merge([
            'title' => 'Blog Comments',
            'comments' => $comments,
            'filters' => $request->only(['status', 'search']),
            'stats' => [
                'pending' => Comment::where('is_approved', false)->count(),
                'approved' => Comment::where('is_approved', true)->count(),
                'total' => Comment::count(),
            ]
        ], $this->getSharedProps()));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'post_id' => 'required|exists:blog_posts,id',
            'parent_id' => 'nullable|exists:blog_comments,id',
            'content' => 'required|string',
            'author_name' => 'required_without:user_id|string|max:255',
            'author_email' => 'required_without:user_id|email|max:255'
        ]);

        $comment = Comment::create([
            ...$validated,
            'user_id' => auth()->id(),
            'is_approved' => auth()->user()?->hasPermission('auto-approve-comments')
                || config('blog.auto_approve_comments', false)
        ]);

        if ($comment->is_approved) {
            $this->notificationService->notifyNewComment($comment);
        }

        return back()->with('success', $comment->is_approved
            ? 'Comment posted successfully'
            : 'Comment submitted for moderation');
    }

    public function approve(Comment $comment)
    {
        $comment->update(['is_approved' => true]);

        // Notify the comment author if they're a registered user
        if ($comment->user) {
            $comment->user->notify(new CommentApproved($comment));
        }

        $this->notificationService->notifyCommentApproved($comment);
        $this->notificationService->notifyNewComment($comment);

        return back()->with('success', 'Comment approved successfully');
    }

    public function reject(Comment $comment)
    {
        // Notify the comment author if they're a registered user
        if ($comment->user) {
            $comment->user->notify(new CommentRejected($comment));
        }

        $comment->delete();
        return back()->with('success', 'Comment rejected successfully');
    }

    public function bulkApprove(Request $request)
    {
        $request->validate([
            'comments' => 'required|array',
            'comments.*' => 'exists:blog_comments,id'
        ]);

        $comments = Comment::whereIn('id', $request->comments)
            ->with('user')
            ->get();

//        foreach ($comments as $comment) {
//            $comment->update(['is_approved' => true]);
//
//            if ($comment->user) {
//                $comment->user->notify(new CommentApproved($comment));
//            }
//        }

        foreach ($comments as $comment) {
            $comment->update(['is_approved' => true]);
            $this->notificationService->notifyCommentApproved($comment);
            $this->notificationService->notifyNewComment($comment);
        }

        return back()->with('success', count($request->comments) . ' comments approved successfully');
    }

    public function bulkReject(Request $request)
    {
        $request->validate([
            'comments' => 'required|array',
            'comments.*' => 'exists:blog_comments,id'
        ]);

        $comments = Comment::whereIn('id', $request->comments)
            ->with('user')
            ->get();

        foreach ($comments as $comment) {
            if ($comment->user) {
                $comment->user->notify(new CommentRejected($comment));
            }
        }

        Comment::whereIn('id', $request->comments)->delete();
        return back()->with('success', count($request->comments) . ' comments rejected successfully');
    }

    public function markAsSpam(Comment $comment)
    {
        $spamService = new SpamDetectionService();
        $analysis = $spamService->analyzeComment($comment);

        if ($analysis['isSpam']) {
            // Add IP to blacklist
            DB::table('spam_ips')->insert([
                'ip_address' => $comment->ip_address,
                'reason' => implode(', ', $analysis['reasons']),
                'expires_at' => now()->addDays(30), // Blacklist for 30 days
                'created_at' => now(),
                'updated_at' => now()
            ]);

            // Add email to spam list if it exists
            if ($comment->author_email) {
                DB::table('spam_emails')->insert([
                    'email' => $comment->author_email,
                    'reason' => implode(', ', $analysis['reasons']),
                    'expires_at' => now()->addDays(30),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

            // Delete all pending comments from this IP/email
            Comment::where('is_approved', false)
                ->where(function ($query) use ($comment) {
                    $query->where('ip_address', $comment->ip_address)
                        ->orWhere('author_email', $comment->author_email);
                })
                ->delete();

            // Log spam detection for training
            Log::channel('spam')->info('Spam comment detected', [
                'comment_id' => $comment->id,
                'ip_address' => $comment->ip_address,
                'email' => $comment->author_email,
                'content' => $comment->content,
                'score' => $analysis['score'],
                'reasons' => $analysis['reasons']
            ]);

            // Delete the comment
            $comment->delete();

            return back()->with('success', 'Comment marked as spam. Similar comments will be blocked automatically.');
        }

        return back()->with('error', 'Comment analyzed but not marked as spam. Score: ' . $analysis['score']);
    }
}
