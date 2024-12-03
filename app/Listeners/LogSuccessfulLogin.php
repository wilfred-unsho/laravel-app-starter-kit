<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use App\Models\LoginAttempt;

class LogSuccessfulLogin
{
    public function handle(Login $event): void
    {
        LoginAttempt::createFromRequest(
            $event->user->email,
            true,
            null,
            $event->user->id
        );
    }
}
