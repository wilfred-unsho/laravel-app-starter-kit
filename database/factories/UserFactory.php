<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        $roles = ['admin', 'user'];
        $domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];

        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->userName() . '@' . $this->faker->randomElement($domains),
            'email_verified_at' => now(),
            'password' => Hash::make('password'), // Default password for all users
            'remember_token' => Str::random(10),
            'role' => $this->faker->randomElement($roles),
            'is_active' => $this->faker->boolean(80), // 80% chance of being active
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => function (array $attributes) {
                return $this->faker->dateTimeBetween($attributes['created_at'], 'now');
            },
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function ($user) {
            $user->profile()->create([
                'phone' => fake()->phoneNumber(),
                'bio' => fake()->paragraphs(2, true),
                'job_title' => fake()->jobTitle(),
                'department' => fake()->randomElement(['IT', 'HR', 'Finance', 'Marketing', 'Operations']),
                'location' => fake()->city() . ', ' . fake()->country(),
                'timezone' => fake()->randomElement(\DateTimeZone::listIdentifiers()),
                'notification_preferences' => [
                    'email' => fake()->boolean(70),
                    'browser' => fake()->boolean(60),
                ],
                'theme_preferences' => [
                    'darkMode' => fake()->boolean(40),
                    'compactMode' => fake()->boolean(30),
                ],
            ]);
        });
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
            'is_active' => true,
        ]);
    }

    public function user(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'user',
        ]);
    }
}
