<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogSubscription extends Model
{
    protected $fillable = [
        'user_id',
        'post_id',
        'notify_new_posts',
        'notify_comments',
        'notify_updates'
    ];

    protected $casts = [
        'notify_new_posts' => 'boolean',
        'notify_comments' => 'boolean',
        'notify_updates' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
