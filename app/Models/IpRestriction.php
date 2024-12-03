<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IpRestriction extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'ip_address',
        'type',
        'reason',
        'created_by',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public static function isIpBlacklisted(string $ip): bool
    {
        return static::where('ip_address', $ip)
            ->where('type', 'blacklist')
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->exists();
    }

    public static function isIpWhitelisted(string $ip): bool
    {
        return static::where('ip_address', $ip)
            ->where('type', 'whitelist')
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->exists();
    }
}
