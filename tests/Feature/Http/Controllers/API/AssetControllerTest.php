<?php

namespace Tests\Feature\Http\Controllers\API;

use App\Models\Asset;
use App\Models\Category;
use App\Models\Location;
use App\Models\User;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Arr;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Passport\Passport;
use Tests\TestCase;

class AssetControllerTest extends TestCase
{
    use WithFaker;

    protected $asset;
    protected $user;
    protected $location;
    protected $category;

    public function setUp(): void
    {
        parent::setUp();

        $this->location = Location::factory()->create();
        $this->category = Category::factory()->for($this->location)->create();
        $this->asset = Asset::factory()->canModify()->for($this->location)->for($this->category, 'category')->create();
        $this->user = User::factory()->for($this->location)->create();

        Passport::actingAs($this->user, ['admin']);
    }

    public function test_staff_can_not_access()
    {
        $staff = User::factory()->for($this->location)->create();
        Passport::actingAs($staff, ['staff']);

        $response = $this->getJson('/api/assets');
        $response->assertStatus(403);

        $response = $this->postJson('/api/assets');
        $response->assertStatus(403);

        $response = $this->getJson('/api/assets/' . $this->asset->id);
        $response->assertStatus(403);

        $response = $this->patchJson('/api/assets/' . $this->asset->id);
        $response->assertStatus(403);

        $response = $this->deleteJson('/api/assets/' . $this->asset->id);
        $response->assertStatus(403);
    }

    public function test_index()
    {
        Asset::factory()->count(10)->for($this->location)->for($this->category)->create();
        $response = $this->getJson('/api/assets');

        $response->assertStatus(200);
    }

    public function test_get_meta_data()
    {
        $response = $this->getJson('/api/assets?meta');

        $response->assertStatus(200);
    }

    public function test_show()
    {
        $response = $this->getJson('/api/assets/' . $this->asset->id);

        $response->assertStatus(200);

        $response->assertJson(function (AssertableJson $json) {
            $json
                ->where('asset.id', $this->asset->id)
                ->where('asset.asset_code', $this->asset->asset_code)
                ->etc();
        });
    }

    public function test_store()
    {
        $state_key = $this->faker->randomElement(Asset::getStoreRequestStates());

        $new_asset = [
            'asset_name' => $this->faker->words(7, true),
            'specific' => $this->faker->realText(),
            'installed_date' => $this->faker->date(),
            'category_id' => $this->category->id,
            'state_key' => $state_key,
        ];

        $response = $this->postJson('/api/assets', $new_asset);

        $response->assertStatus(201);

        $response->assertJson(function (AssertableJson $json) use ($new_asset) {
            $json
                ->where('message', 'Created asset successfully')
                ->where('asset.asset_name', $new_asset['asset_name'])
                ->where('asset.specific', $new_asset['specific'])
                ->where('asset.installed_date', $new_asset['installed_date'])
                ->where('asset.state_key', $new_asset['state_key'])
                ->where('asset.category_id', $new_asset['category_id'])
                ->etc();
        });
    }

    public function test_update()
    {
        $edit_asset = [
            'asset_name' => $this->faker->name(),
            'specific' => $this->faker->sentence(50),
            'installed_date' => $this->faker->date(),
            'state_key' => $this->faker->randomElement(Asset::getUpdateRequestStates())
        ];

        $response = $this->patchJson('/api/assets/' . $this->asset->id, $edit_asset);

        $response->assertStatus(200);

        $response->assertJson(function (AssertableJson $json) use ($edit_asset) {
            $json
                ->where('message', 'Edited asset successfully')
                ->where('asset.asset_name', $edit_asset['asset_name'])
                ->where('asset.specific', $edit_asset['specific'])
                ->where('asset.installed_date', $edit_asset['installed_date'])
                ->where('asset.state_key', $edit_asset['state_key'])
                ->etc();
        });
    }

    public function test_update_unsuccessfully(){
        //If asset's state is ASSIGNED, asset won't be edited.
        $asset = Asset::factory()
            ->state(['state_key' => Asset::ASSIGNED])
            ->for($this->location)
            ->for($this->category)
            ->create();

        $edit_asset = [
            'asset_name' => $this->faker->name(),
            'specific' => $this->faker->sentence(50),
            'installed_date' => $this->faker->date(),
            'state_key' => $this->faker->randomElement(Asset::getUpdateRequestStates())
        ];

        $response = $this->patchJson('/api/assets/' . $asset->id, $edit_asset);

        $response->assertStatus(400);

        $response->assertJson(function (AssertableJson $json){
            $json->where('message', "You can't do any actions on an asset has been assigned");
        });
    }

    public function test_destroy(){
        $response = $this->deleteJson('/api/assets/' . $this->asset->id);

        $response->assertStatus(200);

        $this->assertSoftDeleted($this->asset);
    }

    public function test_destroy_unsuccessfully(){
        //If asset's state is ASSIGNED, asset won't be deleted.
        $asset = Asset::factory()
            ->state(['state_key' => Asset::ASSIGNED])
            ->for($this->location)
            ->for($this->category)
            ->create();

        $response = $this->deleteJson('/api/assets/'. $asset->id);

        $response->assertStatus(400);

        $response->assertJson(function (AssertableJson $json){
            $json
                ->where('message', "You can't do any actions on an asset has been assigned");
        });
    }
}
