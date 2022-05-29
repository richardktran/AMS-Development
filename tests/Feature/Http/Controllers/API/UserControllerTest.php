<?php

namespace Tests\Feature\Http\Controllers\API;

use App\Models\Asset;
use App\Models\Assignment;
use App\Models\Category;
use App\Models\Location;
use App\Models\User;
use App\Services\Business\AuthService;
use App\Services\Contracts\UserServiceContract;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Passport\Passport;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use withFaker;

    protected $user;
    protected $test_user;
    protected $location;

    public function setUp(): void
    {
        parent::setUp();

        $this->location = Location::factory()->create();
        $this->user = User::factory()->for($this->location)->create();
        $this->test_user = User::factory()->for($this->location)->create();

        Passport::actingAs($this->user, ['admin']);
    }

    public function test_staff_can_not_access()
    {
        $staff = User::factory()->for($this->location)->create();
        Passport::actingAs($staff, ['staff']);

        $response = $this->getJson('/api/users');
        $response->assertStatus(403);

        $response = $this->postJson('/api/users');
        $response->assertStatus(403);

        $response = $this->getJson('/api/users/' . $this->user->id);
        $response->assertStatus(403);

        $response = $this->patchJson('/api/users/' . $this->user->id);
        $response->assertStatus(403);

        $response = $this->deleteJson('/api/users/' . $this->user->id);
        $response->assertStatus(403);
    }

    public function test_can_not_access_different_location()
    {
        $user_with_different_location = User::factory()->for(Location::factory())->create();

        $response = $this->getJson('/api/users/' . $user_with_different_location->id);
        $response->assertStatus(403);

        $edit_data = [
            'birthday' => '2001-12-31',
            'joined_date' => '2020-12-31',
            'role_id' => '2',
            'gender' => 'Female'
        ];

        $response = $this->patchJson('/api/users/' . $user_with_different_location->id, $edit_data);
        $response->assertStatus(403);

        $response = $this->deleteJson('/api/users/' . $user_with_different_location->id, $edit_data);
        $response->assertStatus(403);
    }

    public function test_index_users()
    {
        User::factory()->count(10)->for(Location::factory())->create();
        User::factory()->count(10)->for($this->location)->create();

        $response = $this->getJson('/api/users');

        $response->assertStatus(200);
        $response->assertJsonCount(11, 'data'); // included test_user
    }

    public function test_show_user()
    {
        $response = $this->getJson('/api/users/' . $this->test_user->id);

        $response->assertStatus(200);

        $response->assertJson(function (AssertableJson $json) {
            $json
                ->where('user.id', $this->test_user->id)
                ->where('user.staff_code', $this->test_user->staff_code)
                ->etc();
        });
    }

    public function test_update_user()
    {
        $edit_data = [
            'birthday' => '2001-12-31',
            'joined_date' => '2020-12-31',
            'role_id' => '2',
            'gender' => 'Female'
        ];

        $response = $this->patchJson('/api/users/' . $this->test_user->id, $edit_data);

        $response->assertStatus(200);

        $response->assertJson(function (AssertableJson $json) use ($edit_data) {
            $json
                ->where('message', 'Edited user successfully')
                ->where('user.birthday', $edit_data['birthday'])
                ->where('user.joined_date', $edit_data['joined_date'])
                ->where('user.role_id', $edit_data['role_id'])
                ->where('user.gender', $edit_data['gender'])
                ->etc();
        });
    }

    public function test_store_user()
    {
        $new_user_data = [
            'first_name' => 'First',
            'last_name' => 'last name',
            'birthday' => '2000-12-30',
            'joined_date' => '2021-06-01',
            'gender' => $this->faker->randomElement(['Male', 'Female']),
            'role_id' => $this->faker->randomElement([1, 2]),
        ];

        $response = $this->postJson('/api/users', $new_user_data);

        $response->assertStatus(201);

        $response->assertJson(function (AssertableJson $json) use ($new_user_data) {
            $json
                ->where('message', 'Created user successfully')
                ->where('user.username', 'firstln')
                ->where('user.birthday', $new_user_data['birthday'])
                ->where('user.joined_date', $new_user_data['joined_date'])
                ->where('user.role_id', $new_user_data['role_id'])
                ->where('user.gender', $new_user_data['gender'])
                ->etc();
        });

        $response2 = $this->postJson('/api/users', $new_user_data);

        $response2->assertJson(function (AssertableJson $json) use ($new_user_data) {
            $json
                ->where('message', 'Created user successfully')
                ->where('user.username', 'firstln1')
                ->etc();
        });

        $user_id = $response->json()['user']['id'];
        $user = User::findOrFail($user_id);

        $this->assertTrue(Hash::check('firstln@30122000', $user->password));
    }

    public function test_update_assign_after_update_user()
    {
        $asset = Asset::factory()->for($this->location)->for(Category::factory()->for($this->location))->create();
        $user= User::factory(['joined_date' => Carbon::today()])->for($this->location)->create();
        $assignment = Assignment::factory(['assign_date' => Carbon::today()])
            ->for($this->location)
            ->for($asset)
            ->for($this->user, 'assignedByUser')
            ->for($user, 'assignedToUser')
            ->create();

        $new_date = Carbon::today()
            ->startOfWeek(Carbon::MONDAY)
            ->endOfWeek(Carbon::FRIDAY)
            ->addDays(10)
            ->toDateString();

        $edit_data = [
            'birthday' => '2001-12-31',
            'joined_date' => $new_date,
            'role_id' => '2',
            'gender' => 'Female'
        ];

        $response = $this->patchJson('/api/users/' . $user->id, $edit_data);

        $response->assertStatus(200);

        $this->assertDatabaseHas('assignments', [
            'id' => $assignment->id,
            'assign_date' => $new_date
        ]);
    }
}
