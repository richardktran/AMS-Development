<?php

namespace Database\Factories;

use App\Models\Assignment;
use App\Models\User;
use App\Models\Asset;
use App\Models\Location;
use Illuminate\Support\Arr;

use Illuminate\Database\Eloquent\Factories\Factory;

class AssignmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Assignment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $state_key = Arr::random(array_keys(Assignment::STATE_NAMES));

        return [
            'assign_date' => $this->faker->date(),
            'assign_note' => $this->faker->realText(),
            'state_key' => $state_key,
        ];
    }
}
