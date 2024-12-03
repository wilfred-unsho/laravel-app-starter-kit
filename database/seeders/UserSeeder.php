<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create main admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create 9 admin users
        User::factory()
            ->count(9)
            ->admin()
            ->create();

        // Create 40 regular users
        User::factory()
            ->count(40)
            ->user()
            ->create();
    }
}
