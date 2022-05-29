<?php

namespace Database\Factories;

use App\Models\Location;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $username = $this->faker->username();

        return [
          'staff_code' => 'SD' . $this->faker->randomNumber(4),
          'first_name' => $this->faker->firstName(),
          'last_name' => $this->faker->lastName(),
          'username' => $username,
          'base_username' => $username,
          'password' => bcrypt('12345678'),
          'gender' =>  $this->faker->randomElement(['Male', 'Female']),
          'birthday' => $this->faker->dateTime(),
          'joined_date' => $this->faker->dateTime(),
          'role_id' => Role::inRandomOrder()->first(),
          'must_change_password' => $this->faker->boolean(),
        ];
    }
}
