<?php

namespace App\Models\Blog;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class Post extends Model
{
    use SoftDeletes;

    protected $table = 'blog_posts';

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'author_id',
        'status',
        'published_at',
        'meta',
        'reading_time',
        'is_featured',
        'allow_comments'
    ];

    protected $casts = [
        'meta' => 'array',
        'published_at' => 'datetime',
        'is_featured' => 'boolean',
        'allow_comments' => 'boolean'
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'blog_post_category');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'blog_post_tag');
    }

    public function revisions()
    {
        return $this->hasMany(PostRevision::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function views()
    {
        return $this->hasMany(PostView::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->where('published_at', '<=', now());
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled')
            ->where('published_at', '>', now());
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public static function boot()
    {
        parent::boot();

        static::saving(function ($post) {
            // Calculate reading time
            $words = str_word_count(strip_tags($post->content));
            $minutes = ceil($words / 200); // Average reading speed
            $post->reading_time = $minutes;
        });

        static::updating(function ($post) {
            // Create revision
            if ($post->isDirty('content')) {
                $post->revisions()->create([
                    'user_id' => auth()->id(),
                    'content' => $post->getOriginal('content'),
                    'meta' => $post->getOriginal('meta')
                ]);
            }
        });
    }
}
