<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class PasswordPolicyService
{
    public function getPasswordRules(): Password
    {
        $rules = Password::min(config('password-policy.min_length'));

        if (config('password-policy.require_uppercase')) {
            $rules->mixedCase();
        }

        if (config('password-policy.require_numeric')) {
            $rules->numbers();
        }

        if (config('password-policy.require_special_char')) {
            $rules->symbols();
        }

        if (config('password-policy.prevent_common_passwords')) {
            $rules->uncompromised();
        }

        return $rules;
    }

    public function passwordNeedsReset(User $user): bool
    {
        if (!$user->password_changed_at) {
            return true;
        }

        $maxAge = config('password-policy.max_age_days');
        if ($maxAge > 0) {
            return $user->password_changed_at->addDays($maxAge)->isPast();
        }

        return false;
    }

    public function isPasswordReused(User $user, string $password): bool
    {
        $historyLimit = config('password-policy.password_history');

        return $user->passwordHistories()
            ->latest()
            ->take($historyLimit)
            ->get()
            ->contains(function ($history) use ($password) {
                return Hash::check($password, $history->password);
            });
    }

    public function getPasswordStrength(string $password): array
    {
        $strength = 0;
        $feedback = [];

        if (strlen($password) >= config('password-policy.min_length')) {
            $strength += 20;
        } else {
            $feedback[] = 'Password should be at least ' . config('password-policy.min_length') . ' characters long';
        }

        if (preg_match('/[A-Z]/', $password)) {
            $strength += 20;
        } else {
            $feedback[] = 'Add uppercase letters';
        }

        if (preg_match('/[a-z]/', $password)) {
            $strength += 20;
        } else {
            $feedback[] = 'Add lowercase letters';
        }

        if (preg_match('/[0-9]/', $password)) {
            $strength += 20;
        } else {
            $feedback[] = 'Add numbers';
        }

        if (preg_match('/[^A-Za-z0-9]/', $password)) {
            $strength += 20;
        } else {
            $feedback[] = 'Add special characters';
        }

        return [
            'strength' => $strength,
            'feedback' => $feedback
        ];
    }
}
