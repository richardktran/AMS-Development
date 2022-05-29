<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateBaseUsernameInUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        /*
         * Create column
         */
        Schema::table('users', function (Blueprint $table) {
            $table->string('base_username')->nullable();
        });

        /*
         * Generate base_username from first_name and last_name
         */
        $users = DB::table('users')->get(['id', 'first_name', 'last_name']);

        foreach ($users as $user) {
            $first_name = strtolower($user->first_name);

            $last_name = strtolower($user->last_name);

            $words_of_last_name = explode(" ", $last_name);

            $acronym = "";

            foreach ($words_of_last_name as $word) {
                $acronym .= substr($word, 0, 1);
            }
            $base_username = $first_name . $acronym;

            DB::table('users')->where('id', $user->id)->update([
                'base_username' => $base_username
            ]);
        }

        /*
         * Change the column to not-nullable
         */
        Schema::table('users', function (Blueprint $table) {
            $table->string('base_username')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('base_username');
        });
    }
}
