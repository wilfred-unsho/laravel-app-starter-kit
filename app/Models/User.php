<?php

namespace App\Models;

use App\Models\Traits\HasPermissions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasPermissions, TwoFactorAuthenticatable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    public function isAdmin()
    {
        return $this->hasRole('admin');
    }

    /**
     * Check if user has a specific role
     */
    public function hasRole($role)
    {
        // For development, temporarily return true for super-admin
        if ($role === 'super-admin') {
            return true;
        }

        // Implement your actual role checking logic here
        return false;
    }

    public function passwordHistories()
    {
        return $this->hasMany(PasswordHistory::class);
    }

    public function profile()
    {
        return $this->hasOne(Profile::class)->withDefault();
    }

    protected static function boot()
    {
        parent::boot();

        static::updating(function ($user) {
            if ($user->isDirty('password')) {
                $user->password_changed_at = now();
                $user->passwordHistories()->create([
                    'password' => $user->password
                ]);
            }
        });
    }
}
