<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoginAttempt extends Model
{
    protected $fillable = [
        'user_id',
        'email',
        'ip_address',
        'user_agent',
        'was_successful',
        'location',
        'device',
        'browser',
        'platform',
        'failure_reason',
    ];

    protected $casts = [
        'was_successful' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function createFromRequest($email, $wasSuccessful, $failureReason = null, $userId = null)
    {
        $parser = new \WhichBrowser\Parser(request()->userAgent());

        return static::create([
            'user_id' => $userId,
            'email' => $email,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'was_successful' => $wasSuccessful,
            'device' => $parser->device->type ?? 'Unknown',
            'browser' => $parser->browser->name ?? 'Unknown',
            'platform' => $parser->os->name ?? 'Unknown',
            'failure_reason' => $failureReason,
        ]);
    }
}
