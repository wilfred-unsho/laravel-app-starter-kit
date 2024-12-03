<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Role;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateSuperAdmin extends Command
{
    protected $signature = 'admin:create';
    protected $description = 'Create a super admin user';

    public function handle()
    {
        $this->info('Creating Super Admin User...');

        $name = $this->ask('Name');
        $email = $this->ask('Email');
        $password = $this->secret('Password');
        $confirmPassword = $this->secret('Confirm Password');

        // Validate input
        $validator = Validator::make([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'password_confirmation' => $confirmPassword,
        ], [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }
            return 1;
        }

        // Create user
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'email_verified_at' => now(),
        ]);

        // Assign super admin role
        if ($superAdminRole = Role::where('slug', 'super-admin')->first()) {
            $user->roles()->sync([$superAdminRole->id]);
            $this->info('Super admin user created successfully!');
        } else {
            $this->error('Super admin role not found. Please run migrations and seeders first.');
            return 1;
        }

        return 0;
    }
}
