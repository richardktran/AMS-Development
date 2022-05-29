<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Category::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $name = $this->faker->unique()->words(5, true);
        $prefix = static::generatePrefix($name);

        return [
            'category_name' => ucfirst($name),
            'category_prefix' => strtoupper($prefix),
        ];
    }

    private static function generatePrefix($name)
    {
        $words = explode(" ", $name);
        $prefix = '';

        foreach ($words as $word) {
            $prefix .= substr($word, 0, 1);
        }

        return $prefix;
    }
}
