<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MediaFile extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'original_name',
        'path',
        'mime_type',
        'size',
        'collection',
        'disk',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function categories()
    {
        return $this->belongsToMany(MediaCategory::class, 'media_file_category');
    }
}
