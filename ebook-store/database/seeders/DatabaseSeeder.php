<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        User::factory()
        ->admin()
        ->create([
            'name'  => 'Eaint@Admin',
            'email' => 'admin@bytesbooks.com',
            'password' => bcrypt('12345678'),
            'is_admin' => true,
        ]);
    }
}
