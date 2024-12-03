<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Page extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'meta',
        'template',
        'status',
        'published_at'
    ];

    protected $casts = [
        'content' => 'array',
        'meta' => 'array',
        'published_at' => 'datetime'
    ];

    public function revisions()
    {
        return $this->hasMany(PageRevision::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function editor()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($page) {
            $page->created_by = auth()->id();
            $page->updated_by = auth()->id();
        });

        static::updating(function ($page) {
            $page->updated_by = auth()->id();

            // Create revision
            $page->revisions()->create([
                'content' => $page->getOriginal('content'),
                'meta' => $page->getOriginal('meta'),
                'created_by' => auth()->id()
            ]);
        });
    }
}
