<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SessionActivity extends Model
{
    protected $fillable = [
        'session_id',
        'user_id',
        'action',
        'ip_address',
        'device_type',
        'browser',
        'platform',
        'details',
    ];

    protected $casts = [
        'details' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function log($action, $sessionId = null)
    {
        $parser = new \WhichBrowser\Parser(request()->userAgent());

        return static::create([
            'session_id' => $sessionId ?? session()->getId(),
            'user_id' => auth()->id(),
            'action' => $action,
            'ip_address' => request()->ip(),
            'device_type' => $parser->device->type ?? 'Unknown',
            'browser' => $parser->browser->name ?? 'Unknown',
            'platform' => $parser->os->name ?? 'Unknown',
            'details' => [
                'user_agent' => request()->userAgent(),
                'referrer' => request()->header('referer'),
                'current_url' => request()->fullUrl(),
            ],
        ]);
    }
}
