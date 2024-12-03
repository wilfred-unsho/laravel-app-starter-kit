<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MediaCollection extends Model
{
    protected $fillable = ['name', 'description'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($collection) {
            $collection->slug = Str::slug($collection->name);
        });
    }

    public function files()
    {
        return $this->hasMany(MediaFile::class, 'collection', 'slug');
    }
}
