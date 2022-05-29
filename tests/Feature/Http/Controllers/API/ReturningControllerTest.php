<?php

namespace Tests\Feature\Http\Controllers\API;

use App\Models\Asset;
use App\Models\Assignment;
use App\Models\Category;
use App\Models\Location;
use App\Models\Returning;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Passport\Passport;
use Tests\TestCase;

class ReturningControllerTest extends TestCase
{
    use WithFaker;

    protected $location;
    protected $admin;
    protected $user;
    protected $category;
    protected $asset;
    protected $assignment;
    protected $returning;
    protected $assignment_for_return;

    public function setUp(): void
    {
        parent::setUp();

        $this->location = Location::factory()->create();
        $this->admin = User::factory()
            ->state(['role_id' => 1])
            ->for($this->location)->create();
        $this->category = Category::factory()->for($this->location)->create();
        $this->asset = Asset::factory()
            ->state([
                'installed_date' => Carbon::now()->format('Y-m-d'),
                'state_key' => Asset::ASSIGNED
            ])
            ->for($this->location)
            ->for($this->category)
            ->create();
        $this->user = User::factory()
            ->for($this->location)
            ->state(['joined_date' => Carbon::now()->format('Y-m-d')])
            ->create();
        $this->assignment = Assignment::factory()
            ->state([
                'state_key' => Assignment::ACCEPTED,
                'assign_date' => Carbon::now()->format('Y-m-d')
            ])
            ->for($this->location)
            ->for($this->asset)
            ->for($this->admin, 'assignedByUser')
            ->for($this->user, 'assignedToUser')
            ->create();

        $this->assignment_for_return = Assignment::factory()
            ->state([
                'state_key' => Assignment::WAITING_FOR_RETURNING,
                'assign_date' => Carbon::now()->format('Y-m-d')
            ])
            ->for($this->location)
            ->for($this->asset)
            ->for($this->admin, 'assignedByUser')
            ->for($this->user, 'assignedToUser')
            ->create();

        $this->returning = Returning::factory()
            ->state([
                'state_key' => Returning::WAITING_FOR_RETURNING
            ])
            ->for($this->assignment_for_return)
            ->for($this->user, 'requestedByUser')
            ->create();

        Passport::actingAs($this->admin, ['admin']);
    }

    public function test_staff_can_not_access()
    {
        Passport::actingAs($this->user, ['staff']);

        $response = $this->getJson('/api/returnings');
        $response->assertStatus(403);

        $response = $this->patchJson('/api/returnings/' . $this->returning->id);
        $response->assertStatus(403);

        $response = $this->deleteJson('/api/returnings/' . $this->returning->id);
        $response->assertStatus(403);
    }

    public function test_admin_can_access()
    {
        Passport::actingAs($this->user, ['admin']);

        $response = $this->getJson('/api/returnings');
        $response->assertStatus(200);
    }

    public function test_index()
    {
        Returning::factory()->count(10)
            ->for($this->assignment)
            ->for($this->admin, 'acceptedByUser')
            ->for($this->user, 'requestedByUser')
            ->create();

        $response = $this->getJson('/api/returnings');

        $response->assertStatus(200);
    }

    public function test_filter_by_states()
    {
        $states = Returning::getAllStates();
        foreach ($states as $state) {
            $response = $this->getJson('/api/returnings?states[]=' . $state);
            $response->assertStatus(200);
        }
    }

    public function test_filter_by_returned_date()
    {
        $return = Returning::factory()
            ->for($this->assignment)
            ->for($this->admin, 'acceptedByUser')
            ->for($this->user, 'requestedByUser')
            ->create();
        $returned_date_request = date("Y/m/d", strtotime($return->returned_date));
        $response = $this->getJson('/api/returnings?date=' . $returned_date_request);

        $response->assertStatus(200);
    }

    public function test_search_by_asset_code()
    {
        $response = $this->getJson('/api/returnings?search=' . $this->asset->asset_code);
        $response->assertStatus(200);
    }
    public function test_search_by_asset_name()
    {
        $response = $this->getJson('/api/returnings?search=' . $this->asset->asset_name);
        $response->assertStatus(200);
    }
    public function test_search_by_requested_username()
    {
        $response = $this->getJson('/api/returnings?search=' . $this->user->username);
        $response->assertStatus(200);
    }

    public function test_create_success()
    {
        $response = $this->post('/api/assignments/' . $this->assignment->id . '/return');
        $response->assertStatus(201);

        $response->assertJson(function (AssertableJson $json) {
            $json
                ->where('message', 'Create returning request successfully')
                ->where('returning.assignment_id', $this->assignment->id)
                ->where('returning.requested_by', $this->admin->id)
                ->where('returning.state_key', Returning::WAITING_FOR_RETURNING)
                ->etc();
        });
    }

    public function test_create_failed_not_on_accepted_asignment()
    {
        $assignment = Assignment::factory()
            ->state([
                'state_key' => Assignment::WAITING_FOR_ACCEPTANCE,
                'assign_date' => Carbon::now()->format('Y-m-d')
            ])
            ->for($this->location)
            ->for($this->asset)
            ->for($this->admin, 'assignedByUser')
            ->for($this->user, 'assignedToUser')
            ->create();

        $response = $this->post('/api/assignments/' . $assignment->id . '/return');
        $response->assertStatus(400);

        $response->assertJson(function (AssertableJson $json) {
            $json
                ->where('message', 'You can only return on ACCEPTED assignment');
        });
    }

    public function test_staff_can_return_their_assignment()
    {
        $staff = User::factory()
            ->state(['role_id' => 2])
            ->for($this->location)
            ->create();
        Passport::actingAs($staff, ['staff']);

        $assignment = Assignment::factory()
            ->state([
                'state_key' => Assignment::ACCEPTED,
                'assign_date' => Carbon::now()->format('Y-m-d')
            ])
            ->for($this->location)
            ->for($this->asset)
            ->for($this->admin, 'assignedByUser')
            ->for($staff, 'assignedToUser')
            ->create();

        $response = $this->post('/api/my/assignments/' . $assignment->id . '/return');
        $response->assertStatus(201);

        $response->assertJson(function (AssertableJson $json) use ($staff, $assignment) {
            $json
                ->where('message', 'Create returning request successfully')
                ->where('returning.assignment_id', $assignment->id)
                ->where('returning.requested_by', $staff->id)
                ->where('returning.state_key', Returning::WAITING_FOR_RETURNING)
                ->etc();
        });
    }

    public function test_staff_cant_return_another_staff_assignment()
    {
        $staff = User::factory()
            ->state(['role_id' => 2])
            ->for($this->location)
            ->create();
        Passport::actingAs($staff, ['staff']);

        $assignment = Assignment::factory()
            ->state([
                'state_key' => Assignment::WAITING_FOR_ACCEPTANCE,
                'assign_date' => Carbon::now()->format('Y-m-d')
            ])
            ->for($this->location)
            ->for($this->asset)
            ->for($this->admin, 'assignedByUser')
            ->for($this->user, 'assignedToUser')
            ->create();

        $response = $this->post('/api/my/assignments/' . $assignment->id . '/return');
        $response->assertStatus(403);

        $response->assertJson(function (AssertableJson $json) {
            $json
                ->where('message', "You don't have permission to create returning request for this assignment");
        });
    }

    public function test_admin_complete_success()
    {
        $complete = ['state_key' => Returning::COMPLETED];

        $response = $this->patchJson('/api/returnings/' . $this->returning->id, $complete);

        $response->assertStatus(200);

        $this->assertSoftDeleted($this->assignment_for_return);

        $this->assertDatabaseHas('returnings', [
            'id' => $this->returning->id,
            'state_key' => Returning::COMPLETED,
            'accepted_by' => $this->admin->id,
            'returned_date' => Carbon::today()
        ]);

        $this->assertDatabaseHas('assets', [
            'id' => $this->asset->id,
            'state_key' => Asset::AVAILABLE
        ]);
    }

    public function test_admin_cancel_success()
    {
        $response = $this->deleteJson('/api/returnings/' . $this->returning->id);

        $response->assertStatus(200);

        $this->assertSoftDeleted($this->returning);

        $this->assertDatabaseHas('assignments', [
            'id' => $this->assignment_for_return->id,
            'state_key' => Assignment::ACCEPTED
        ]);
    }

    public function test_admin_cancel_unsuccessful()
    {
        $returning = Returning::factory()
            ->state([
                'state_key' => Returning::COMPLETED
            ])
            ->for($this->assignment)
            ->for($this->user, 'requestedByUser')
            ->create();

        $response = $this->deleteJson('/api/returnings/' . $returning->id);

        $response->assertStatus(400);
    }
}
