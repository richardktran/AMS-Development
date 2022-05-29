<?php

namespace Database\Factories;

use App\Models\Asset;
use App\Models\Category;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;


class AssetFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Asset::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'asset_code' => 'TT' . $this->faker->unique()->randomNumber(6),
            'asset_name' => $this->faker->words(7, true),
            'specific' => $this->faker->realText(),
            'installed_date' => $this->faker->dateTime(),
            'state_key' => $this->faker->randomElement(Asset::getAllStates()),
        ];
    }

    public function canModify()
    {
        return $this->state(function (array $attributes) {
            return [
                'state_key' => $this->faker->randomElement([
                    Asset::AVAILABLE,
                    Asset::NOT_AVAILABLE,
                    Asset::RECYCLED,
                    Asset::WAITING_FOR_RECYCLING,
                ]),
            ];
        });
    }

    public function canNotModify()
    {
        return $this->state(function (array $attributes) {
            return [
                'state_key' => Asset::ASSIGNED,
            ];
        });
    }

    public function setState($state)
    {
        return $this->state(function (array $attributes) use ($state) {
            return [
                'state_key' => $state,
            ];
        });
    }
}
