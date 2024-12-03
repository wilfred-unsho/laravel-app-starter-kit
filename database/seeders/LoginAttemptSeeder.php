<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LoginAttempt;
use App\Models\User;
use Faker\Factory as Faker;

class LoginAttemptSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $users = User::all();

        // Create successful login attempts
        foreach ($users as $user) {
            for ($i = 0; $i < rand(3, 8); $i++) {
                LoginAttempt::create([
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'ip_address' => $faker->ipv4,
                    'user_agent' => $faker->userAgent,
                    'was_successful' => true,
                    'device' => $faker->randomElement(['desktop', 'mobile', 'tablet']),
                    'browser' => $faker->randomElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
                    'platform' => $faker->randomElement(['Windows', 'MacOS', 'iOS', 'Android']),
                    'created_at' => $faker->dateTimeBetween('-30 days', 'now'),
                ]);
            }
        }

        // Create some failed attempts
        for ($i = 0; $i < 20; $i++) {
            $user = $faker->randomElement($users);
            LoginAttempt::create([
                'user_id' => $user->id,
                'email' => $user->email,
                'ip_address' => $faker->ipv4,
                'user_agent' => $faker->userAgent,
                'was_successful' => false,
                'device' => $faker->randomElement(['desktop', 'mobile', 'tablet']),
                'browser' => $faker->randomElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
                'platform' => $faker->randomElement(['Windows', 'MacOS', 'iOS', 'Android']),
                'failure_reason' => $faker->randomElement([
                    'Invalid credentials',
                    'Account locked',
                    'Invalid 2FA code',
                    'Password expired'
                ]),
                'created_at' => $faker->dateTimeBetween('-30 days', 'now'),
            ]);
        }
    }
}
