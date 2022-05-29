<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $locations_arr = ['Ha Noi', 'Ho Chi Minh', 'London', 'New York', 'Australia'];
        $locations_obj = [];

        foreach ($locations_arr as $location) {
            array_push($locations_obj, ['location_name' => $location]);
        }

        DB::table('locations')->insert($locations_obj);
    }
}
