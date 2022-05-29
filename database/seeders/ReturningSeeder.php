<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\Assignment;
use App\Models\Category;
use App\Models\Location;
use App\Models\Returning;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReturningSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        try {
            $admin = User::where('username', 'admin')->firstOrFail();
            $location = $admin->location;
        } catch (\Exception $e) {
            $location = Location::find(1) ?? Location::factory()->create();
            $admin = User::factory()->state(['username'  => 'admin'])->for($location)->create();
        }

        $category = Category::factory()->for($location)->create();
        Assignment::factory()
            ->state([
                'state_key' => Assignment::WAITING_FOR_RETURNING
            ])
            ->count(100)
            ->for($location)
            ->for(Asset::factory()->for($location)->for($category)->create())
            ->for($admin, 'assignedByUser')
            ->for(User::factory()->for($location)->create(), 'assignedToUser')
            ->afterCreating(function (Assignment $assignment) use ($admin) {
                Returning::factory()->for($assignment)->for($admin, 'requestedByUser')->create();
            })
            ->create();
    }
}
