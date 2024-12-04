<?php

namespace App\Models\Blog;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $table = 'blog_tags';

    protected $fillable = [
        'name',
        'slug',
        'description'
    ];

    public function posts()
    {
        return $this->belongsToMany(Post::class, 'blog_post_tag');
    }
}
