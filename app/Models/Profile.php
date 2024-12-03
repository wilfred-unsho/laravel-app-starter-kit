<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'avatar',
        'phone',
        'bio',
        'job_title',
        'department',
        'location',
        'timezone',
        'notification_preferences',
        'theme_preferences',
    ];

    protected $casts = [
        'notification_preferences' => 'array',
        'theme_preferences' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
