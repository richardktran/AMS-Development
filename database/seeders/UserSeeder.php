<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            [
                'staff_code' => 'SD0001',
                'first_name' => 'Admin',
                'last_name' => 'User',
                'username' => 'admin',
                'base_username' => 'admin',
                'password' => Hash::make('12345678'),
                'birthday' => '2000-1-1',
                'joined_date' => '2021-8-3',
                'role_id' => 1,
                'location_id' => 1,
                'must_change_password' => true,
                'gender' =>'Male',
                'created_at' => now(),
                'updated_at' => now(),
            ], [
                'staff_code' => 'SD0002',
                'first_name' => 'Staff',
                'last_name' => 'User',
                'username' => 'staff',
                'base_username' => 'staff',
                'password' => Hash::make('12345678'),
                'birthday' => '2000-1-1',
                'joined_date' => '2021-8-3',
                'role_id' => 2,
                'location_id' => 1,
                'must_change_password' => true,
                'gender' =>'Male',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
