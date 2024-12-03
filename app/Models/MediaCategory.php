<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MediaCategory extends Model
{
    protected $fillable = ['name', 'description'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($category) {
            $category->slug = Str::slug($category->name);
        });
    }

    public function files()
    {
        return $this->belongsToMany(MediaFile::class, 'media_file_category');
    }
}
