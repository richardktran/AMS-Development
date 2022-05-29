<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $category_prefix = array('LA', 'PC', 'MO');
        $category_name = array(
            'Laptop',
            'PC',
            'Monitor',

        );

        $categories = [];

        for ($i = 0; $i < count($category_prefix); $i++) {
            array_push($categories, ['category_prefix' => $category_prefix[$i], 'category_name' => $category_name[$i]]);
        }



        DB::table('categories')->insert($categories);
    }
}
