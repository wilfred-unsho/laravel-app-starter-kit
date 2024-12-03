<?php

namespace App\Services;

use App\Models\LoginAttempt;
use App\Models\IpRestriction;
use Carbon\Carbon;

class SecurityService
{
    protected $maxFailedAttempts = 5;
    protected $timeWindow = 15; // minutes
    protected $blockDuration = 60; // minutes

    public function checkFailedAttempts(string $ip): bool
    {
        $recentFailedAttempts = LoginAttempt::where('ip_address', $ip)
            ->where('was_successful', false)
            ->where('created_at', '>=', Carbon::now()->subMinutes($this->timeWindow))
            ->count();

        if ($recentFailedAttempts >= $this->maxFailedAttempts) {
            $this->blacklistIp($ip);
            return true;
        }

        return false;
    }

    protected function blacklistIp(string $ip): void
    {
        IpRestriction::create([
            'ip_address' => $ip,
            'type' => 'blacklist',
            'reason' => "Automated block: {$this->maxFailedAttempts} failed login attempts in {$this->timeWindow} minutes",
            'expires_at' => Carbon::now()->addMinutes($this->blockDuration),
        ]);
    }

    public function getLoginAttemptStats(string $ip): array
    {
        $failedAttempts = LoginAttempt::where('ip_address', $ip)
            ->where('was_successful', false)
            ->where('created_at', '>=', Carbon::now()->subMinutes($this->timeWindow))
            ->count();

        return [
            'recent_failed_attempts' => $failedAttempts,
            'attempts_remaining' => max(0, $this->maxFailedAttempts - $failedAttempts),
            'window_minutes' => $this->timeWindow,
        ];
    }
}
