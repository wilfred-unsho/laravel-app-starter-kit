<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Failed;
use App\Models\LoginAttempt;
use App\Models\User;
use App\Services\SecurityService;

class LogFailedLogin
{
    protected $securityService;

    public function __construct(SecurityService $securityService)
    {
        $this->securityService = $securityService;
    }

    public function handle(Failed $event): void
    {
        $ip = request()->ip();
        $user = User::where('email', $event->credentials['email'])->first();

        LoginAttempt::createFromRequest(
            $event->credentials['email'],
            false,
            'Invalid credentials',
            $user?->id
        );

        // Check for repeated failed attempts and potentially blacklist IP
        $this->securityService->checkFailedAttempts($ip);
    }
}
