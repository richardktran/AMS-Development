<?php

namespace Database\Factories;

use App\Models\Returning;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

class ReturningFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Returning::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $state_key = Arr::random(array_keys(Returning::STATE_NAMES));

        return [
            'returned_date' => $this->faker->date(),
            'state_key' => $state_key,
        ];
    }
}
