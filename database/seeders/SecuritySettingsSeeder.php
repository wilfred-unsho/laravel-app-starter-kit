<?php

namespace Database\Seeders;

use App\Models\SecuritySetting;
use Illuminate\Database\Seeder;

class SecuritySettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'session_lifetime',
                'value' => 120,
                'group' => 'sessions',
                'type' => 'integer',
                'description' => 'Session timeout in minutes'
            ],
            [
                'key' => 'session_inactivity_timeout',
                'value' => 30,
                'group' => 'sessions',
                'type' => 'integer',
                'description' => 'Inactivity timeout in minutes'
            ],
            [
                'key' => 'max_sessions_per_user',
                'value' => 5,
                'group' => 'sessions',
                'type' => 'integer',
                'description' => 'Maximum number of concurrent sessions per user'
            ],
            [
                'key' => 'force_logout_after_password_change',
                'value' => true,
                'group' => 'sessions',
                'type' => 'boolean',
                'description' => 'Force logout from all devices after password change'
            ],
        ];

        foreach ($settings as $setting) {
            SecuritySetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
