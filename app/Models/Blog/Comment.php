<?php

namespace App\Models\Blog;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class Comment extends Model
{
    use SoftDeletes;

    protected $table = 'blog_comments';

    protected $fillable = [
        'post_id',
        'user_id',
        'parent_id',
        'content',
        'author_name',
        'author_email',
        'author_website',
        'is_approved',
        'ip_address',
        'user_agent'
    ];

    protected $casts = [
        'is_approved' => 'boolean'
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected static function boot()
    {
        parent::boot();

        // Store IP and User Agent on creation
        static::creating(function ($comment) {
            if (empty($comment->ip_address)) {
                $comment->ip_address = request()->ip();
            }
            if (empty($comment->user_agent)) {
                $comment->user_agent = request()->userAgent();
            }
        });
    }

    /**
     * Get the post that owns the comment.
     */
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * Get the user who wrote the comment.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the parent comment.
     */
    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    /**
     * Get the replies to this comment.
     */
    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    /**
     * Scope for approved comments.
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    /**
     * Scope for pending comments.
     */
    public function scopePending($query)
    {
        return $query->where('is_approved', false);
    }

    /**
     * Scope for root comments (no parent).
     */
    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Get author name (registered user or guest).
     */
    public function getAuthorNameAttribute($value)
    {
        return $value ?: $this->user?->name ?? 'Anonymous';
    }

    /**
     * Get author email (registered user or guest).
     */
    public function getAuthorEmailAttribute($value)
    {
        return $value ?: $this->user?->email;
    }

    /**
     * Check if the comment has replies.
     */
    public function hasReplies()
    {
        return $this->replies()->count() > 0;
    }

    /**
     * Check if the comment is from a registered user.
     */
    public function isRegisteredUser()
    {
        return !is_null($this->user_id);
    }

    /**
     * Get the depth level of nested comments.
     */
    public function getDepthLevel()
    {
        $level = 0;
        $comment = $this;

        while ($comment->parent) {
            $level++;
            $comment = $comment->parent;
        }

        return $level;
    }

    /**
     * Get all comments in threaded format.
     */
    public static function getThreaded($postId)
    {
        return static::with(['user', 'replies.user'])
            ->where('post_id', $postId)
            ->approved()
            ->root()
            ->latest()
            ->get();
    }

    /**
     * Check if a user can moderate this comment.
     */
    public function canModerate($user)
    {
        return $user->can('moderate-comments') ||
            ($this->post->author_id === $user->id);
    }
}
