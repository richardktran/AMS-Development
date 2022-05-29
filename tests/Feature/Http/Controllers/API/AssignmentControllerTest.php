<?php

namespace Tests\Feature\Http\Controllers\API;

use App\Models\Asset;
use App\Models\Assignment;
use App\Models\Category;
use App\Models\Location;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Passport\Passport;
use Locale;
use Tests\TestCase;

class AssignmentControllerTest extends TestCase
{
    use WithFaker;

    protected $location;
    protected $admin;
    protected $user;
    protected $category;
    protected $asset;
    protected $assignment;
    protected $after_10_days;
    protected $available_asset;

    public function setUp(): void
    {
        parent::setUp();

        $this->after_10_days = Carbon::now()->addDays(10)->format('Y-m-d');

        $this->location = Location::factory()->create();
        $this->admin = User::factory()->for($this->location)->create();
        $this->category = Category::factory()->for($this->location)->create();
        $this->asset = Asset::factory()
            ->state([
                'installed_date' => $this->after_10_days,
                'state_key' => Asset::ASSIGNED
            ])
            ->for($this->location)
            ->for($this->category)
            ->create();
        $this->available_asset = Asset::factory()
            ->state([
                'installed_date' => $this->after_10_days,
                'state_key' => Asset::AVAILABLE
            ])
            ->for($this->location)
            ->for($this->category)
            ->create();
        $this->user = User::factory()
            ->for($this->location)
            ->state(['joined_date' => $this->after_10_days])
            ->create();
        $this->assignment = Assignment::factory()
            ->state([
                'state_key' => Assignment::WAITING_FOR_ACCEPTANCE,
                'assign_date' => $this->after_10_days
            ])
            ->for($this->location)
            ->for($this->asset)
            ->for($this->admin, 'assignedByUser')
            ->for($this->user, 'assignedToUser')
            ->create();

        Passport::actingAs($this->admin, ['admin']);
    }

    public function example_test()
    {
        $this->assertTrue(true);
    }

    public function test_staff_can_not_access()
    {
        Passport::actingAs($this->user, ['staff']);

        $response = $this->getJson('/api/assignments');
        $response->assertStatus(403);

        $response = $this->getJson('/api/assignments/' . $this->assignment->id);
        $response->assertStatus(403);

        $response = $this->patchJson('/api/assignments/' . $this->assignment->id);
        $response->assertStatus(403);

        $response = $this->postJson('/api/assignments');
        $response->assertStatus(403);

        $response = $this->deleteJson('/api/assignments/' . $this->assignment->id);
        $response->assertStatus(403);

    }

    public function test_index()
    {
        Assignment::factory()->count(10)
            ->for($this->location)
            ->for($this->asset)
            ->for($this->admin, 'assignedByUser')
            ->for($this->user, 'assignedToUser')
            ->create();

        $response = $this->getJson('/api/assignments');

        $response->assertStatus(200);
        $response->assertJsonCount(11, 'data'); // included setUp() assignment
    }

    public function test_show()
    {
        $response = $this->getJson('/api/assignments/' . $this->assignment->id);

        $response->assertStatus(200);

        $response->assertJson(function (AssertableJson $json) {
            $json
                ->where('assignment.id', $this->assignment->id)
                ->where('assignment.to_username', $this->assignment->assignedToUser->username)
                ->where('assignment.by_username', $this->assignment->assignedByUser->username)
                ->etc();
        });
    }

    public function test_get_meta_data()
    {
        $response = $this->getJson('/api/assignments/states');

        $response->assertStatus(200);
    }

    public function test_create_success()
    {
        $create_assignment = [
            'assigned_to' => $this->user->id,
            'asset_id' => $this->available_asset->id,
            'assign_date' => Carbon::now()->addDays(31)->toDateString(),
            'assign_note' => $this->faker->realText()
        ];

        $response = $this->postJson('/api/assignments', $create_assignment);
        $response->assertStatus(201);

        $response->assertJson(function (AssertableJson $json) use ($create_assignment) {
            $json
                ->where('message', 'Created assignment successfully')
                ->where('assignment.assigned_to', $create_assignment['assigned_to'])
                ->where('assignment.asset_id', $create_assignment['asset_id'])
                ->where('assignment.assign_date', $create_assignment['assign_date'])
                ->where('assignment.assign_note', $create_assignment['assign_note'])
                ->etc();
        });
    }

    public function test_create_asset_different_location()
    {
        $new_location = Location::factory()->create();

        $asset = Asset::factory()
            ->setState(Asset::AVAILABLE)
            ->for($new_location)
            ->for(Category::factory()->for($this->location))
            ->create();

        $create_assignment = [
            'assigned_to' => $this->user->id,
            'asset_id' => $asset->id,
            'assign_date' => Carbon::now()->addDays(31)->format('Y-m-d'),
            'assign_note' => $this->faker->realText()
        ];

        $response = $this->postJson('/api/assignments', $create_assignment);
        $response->assertStatus(403);

        $response->assertJson(function (AssertableJson $json) {
            $json
                ->where('message', 'Asset are not belongs to your location');
        });
    }

    public function test_create_asset_not_available()
    {
        $asset = Asset::factory()
            ->setState(Asset::NOT_AVAILABLE)
            ->for($this->location)
            ->for(Category::factory()->for($this->location))
            ->create();

        $create_assignment = [
            'assigned_to' => $this->user->id,
            'asset_id' => $asset->id,
            'assign_date' => Carbon::now()->addDays(31)->format('Y-m-d'),
            'assign_note' => $this->faker->realText()
        ];

        $response = $this->postJson('/api/assignments', $create_assignment);
        $response->assertStatus(400);

        $response->assertJson(function (AssertableJson $json) {
            $json
                ->where('message', 'You can\'t create an assignment with asset has not been available');
        });
    }

    public function test_create_assign_myself()
    {
        $create_assignment = [
            'assigned_to' => $this->admin->id,
            'asset_id' => $this->available_asset->id,
            'assign_date' => Carbon::parse($this->asset->installed_date)->addDay()->toDateString(),
            'assign_note' => $this->faker->realText()
        ];

        $response = $this->postJson('/api/assignments', $create_assignment);
        $response->assertStatus(400);

        $response->assertJson(function (AssertableJson $json) {
            $json
                ->where('message', 'You can\'t assign assignment to yourself');
        });
    }

    public function test_update_success()
    {
        $new_user_assigned = User::factory()
            ->state([
                'joined_date' => Carbon::now(),
            ])
            ->for($this->location)
            ->create();

        $new_asset = Asset::factory()
            ->state([
                'installed_date' => Carbon::now(),
                'state_key' => Asset::AVAILABLE
            ])
            ->for($this->location)
            ->for($this->category)
            ->create();

        $edit_assignment = [
            'assigned_to' => $new_user_assigned->id,
            'asset_id' => $new_asset->id,
            'assign_note' => $this->faker->realText()
        ];

        $max_date = max([
            $this->assignment->assign_date,
            $new_user_assigned->joined_date,
            $new_asset->installed_date
        ]);

        $response = $this->patchJson('/api/assignments/' . $this->assignment->id, $edit_assignment);
        $response->assertStatus(200);

        $response->assertJson(function (AssertableJson $json) use ($edit_assignment, $max_date) {
            $json
                ->where('message', 'Edited assignment successfully')
                ->where('assignment.assigned_to', $edit_assignment['assigned_to'])
                ->where('assignment.asset_id', $edit_assignment['asset_id'])
                ->where('assignment.assign_date', $max_date->toDateString())
                ->where('assignment.assign_note', $edit_assignment['assign_note'])
                ->etc();
        });

        $this->assertDatabaseHas('assets',[
            'id' => $new_asset->id,
            'state_key' => Asset::ASSIGNED
        ]);
    }

    public function test_update_responded_assignment()
    {
        $assignment = Assignment::factory()
            ->state(['state_key' => Assignment::ACCEPTED])
            ->for($this->location)
            ->for($this->asset)
            ->for($this->admin, 'assignedByUser')
            ->for($this->user, 'assignedToUser')
            ->create();

        $new_asset = Asset::factory()
            ->state([
                'installed_date' => Carbon::now(),
                'state_key' => Asset::AVAILABLE
            ])
            ->for($this->location)
            ->for($this->category)
            ->create();

        $edit_assignment = [
            'assigned_to' => $this->user->id,
            'asset_id' => $new_asset->id,
            'assign_date' => Carbon::today()->addDay(15)->format('Y-m-d'),
            'assign_note' => $this->faker->realText()
        ];

        $response = $this->patchJson('/api/assignments/' . $assignment->id, $edit_assignment);
        $response->assertStatus(400);

        $response->assertJson(function (AssertableJson $json) {
            $json
                ->where('message', "You can't do any actions on an assignment which has been responded by user");
        });
    }

    public function test_destroy_success()
    {
        $response = $this->deleteJson('/api/assignments/' . $this->assignment->id);

        $response->assertStatus(200);

        $this->assertSoftDeleted($this->assignment);

        $this->assertDatabaseHas('assets', [
            'id' => $this->asset->id,
            'state_key' => Asset::AVAILABLE
        ]);
    }

    public function test_destroy_unsuccessfully()
    {
        $assignment = Assignment::factory()
            ->state(['state_key' => Assignment::ACCEPTED])
            ->for($this->location)
            ->for($this->asset)
            ->for($this->admin, 'assignedByUser')
            ->for($this->user, 'assignedToUser')
            ->create();

        $response = $this->deleteJson('/api/assignments/' . $assignment->id);

        $response->assertStatus(400);
    }

    public function test_destroy_difference_location()
    {
        $assignment = Assignment::factory()
            ->state(['state_key' => Assignment::ACCEPTED])
            ->for(Location::factory())
            ->for($this->asset)
            ->for($this->admin, 'assignedByUser')
            ->for($this->user, 'assignedToUser')
            ->create();

        $response = $this->deleteJson('/api/assignments/' . $assignment->id);

        $response->assertStatus(403);
    }

    public function test_own_assignments()
    {
        Assignment::factory()->count(10)
            ->for($this->location)
            ->for($this->asset)
            ->for($this->admin, 'assignedByUser')
            ->for($this->user, 'assignedToUser')
            ->create();

        $response = $this->getJson('/api/my/assignments');

        $response->assertStatus(200);
    }

    public function test_response_accept_assigment()
    {
        Passport::actingAs($this->user,['staff']);

        $response_assign = ['state_key' => Assignment::ACCEPTED];

        $response = $this->patchJson('/api/my/assignments/' . $this->assignment->id, $response_assign);

        $response->assertStatus(200);

        $this->assertDatabaseHas('assignments', [
            'id' => $this->assignment->id,
            'state_key' => Assignment::ACCEPTED,
            'assign_date' => Carbon::today()
        ]);
    }

    public function test_response_decline_assignment()
    {
        Passport::actingAs($this->user,['staff']);

        $response_assign = ['state_key' => Assignment::DECLINED];

        $response = $this->patchJson('/api/my/assignments/' . $this->assignment->id, $response_assign);

        $response->assertStatus(200);

        $this->assertDatabaseHas('assignments', [
            'id' => $this->assignment->id,
            'state_key' => Assignment::DECLINED
        ]);

        $this->assertDatabaseHas('assets',[
            'id' => $this->asset->id,
            'state_key' => Asset::AVAILABLE
        ]);
    }

    public function test_can_not_response()
    {
        Passport::actingAs($this->user,['staff']);

        $assignment = Assignment::factory()
        ->state(['state_key' => Assignment::ACCEPTED])
        ->for($this->location)
        ->for($this->asset)
        ->for($this->admin, 'assignedByUser')
        ->for($this->user, 'assignedToUser')
        ->create();

        $response_assign = ['state_key' => $this->faker->randomElement(Assignment::getResponseStates())];

        $response = $this->patchJson('/api/my/assignments/' . $assignment->id, $response_assign);

        $response->assertStatus(400);
    }
}
