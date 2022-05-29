<?php

use App\Models\Category;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLocationIdToCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->foreignId('location_id')->nullable();
        });

        /*
         * Auto fill location_id
         */
        $categories = Category::all();

        foreach ($categories as $category) {
            $location_id = $category->assets->first()->location_id ?? 1;

            $category->update([
                'location_id' => $location_id,
            ]);
        }

        /*
         * Change the column to not-nullable
         */
        Schema::table('categories', function (Blueprint $table) {
            $table->foreignId('location_id')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('location_id');
        });
    }
}
