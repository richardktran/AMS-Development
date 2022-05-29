<?php

namespace Tests\Feature\Http\Controllers\API;

use App\Models\Asset;
use App\Models\Category;
use App\Models\Location;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Passport\Passport;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    protected $user;
    protected $category;
    protected $location;

    public function setUp(): void
    {
        parent::setUp();

        $this->location = Location::factory()->create();
        $this->category = Category::factory()->for($this->location)->create();
        $this->user = User::factory()->for($this->location)->create();

        Passport::actingAs($this->user, ['admin']);
    }

    public function test_index_category()
    {
        Category::factory()->count(10)->for($this->location)->create();
        $response = $this->getJson('/api/categories');

        $response->assertStatus(200);
    }

    public function test_show_category()
    {
        $response = $this->getJson('/api/categories/' . $this->category->id);

        $response->assertStatus(200);
        $response->assertJson(function (AssertableJson $json) {
            $json->where('category.id', $this->category->id);
        });
    }

    public function test_store_category()
    {
        $new_category = Category::factory()->make();

        $response = $this->postJson('/api/categories', $new_category->toArray());

        $response->assertStatus(201);
        $response->assertJson(function (AssertableJson $json) use ($new_category) {
            $json->where('message', 'Created category successfully')
                ->where('category.category_name', $new_category->category_name)
                ->where('category.category_prefix', $new_category->category_prefix);
        });
    }

    public function test_store_category_with_existed_data()
    {
        $response = $this->postJson('/api/categories', $this->category->toArray());
        $response->assertStatus(400);
    }
}
