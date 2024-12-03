<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageTemplate extends Model
{
    protected $fillable = ['name', 'description', 'layout', 'meta_schema'];
    protected $casts = ['meta_schema' => 'array', 'layout' => 'array'];
}
