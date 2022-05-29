<?php

namespace Tests\Feature\Http\Controllers\API;

use App\Models\Location;
use App\Models\User;
use App\Services\Business\AuthService;
use App\Services\Contracts\AuthServiceContract;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Passport\Passport;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    protected $user;
    protected $location;

    public function setup(): void
    {
        parent::setup();

        $this->location = Location::factory()->create();
        $this->user = User::factory()->for($this->location)->create();
    }

    public function test_login_successfully()
    {
        $response = $this->postJson('/api/login', [
            'username' => $this->user->username,
            'password' => '12345678',
        ]);

        $response->assertStatus(200);

        $response->assertJson(function (AssertableJson $json) {
            $json
                ->has('access_token')
                ->has('user')
                ->where('user.id', $this->user->id);
        });
    }

    public function test_cannot_login_with_wrong_usernname()
    {
        $response = $this->postJson('/api/login', [
            'username' => "It's wrong",
            'password' => '12345678',
        ]);

        $response->assertStatus(401);

        $response->assertJson(function (AssertableJson $json) {
            $json->where('message', 'Username or password is incorrect. Please try again');
        });
    }

    public function test_cannot_login_with_wrong_password()
    {
        $response = $this->postJson('/api/login', [
            'username' => $this->user->username,
            'password' => 'wrong_password',
        ]);

        $response->assertStatus(401);

        $response->assertJson(function (AssertableJson $json) {
            $json->where('message', 'Username or password is incorrect. Please try again');
        });
    }

    public function test_logout_successfully()
    {
        // Can not using actionAs() because it haven't token to revoke().
        // So have to login first to get tokens

        $service = app(AuthServiceContract::class);

        $token = $service->login([
            'username' => $this->user->username,
            'password' => '12345678',
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)->postJson('/api/logout');

        $response->assertStatus(200);
    }

    public function test_change_password_first_time()
    {
        $user = User::factory()
            ->state(['must_change_password' => true])
            ->for($this->location)
            ->create();

        Passport::actingAs($user, [$user->role->role_name]);

        $response = $this
            ->patchJson('/api/change-password', [
                'new_password' => 'new_password'
            ]);

        $response->assertStatus(200);
        $response->assertJson(function (AssertableJson $json) use ($user) {
            $json->where('message', 'Your password has been changed successfully')
                ->where('user.id', $user->id);
        });
    }

    public function test_change_password_normal()
    {
        $user = User::factory()
            ->state(['must_change_password' => false])
            ->for($this->location)
            ->create();

        Passport::actingAs($user, [$this->user->role->role_name]);

        $response = $this
            ->patchJson('/api/change-password', [
                'old_password' => '12345678',
                'new_password' => 'new_password'
            ]);

        $response->assertStatus(200);
        $response->assertJson(function (AssertableJson $json) use ($user) {
            $json->where('message', 'Your password has been changed successfully')
                ->where('user.id', $user->id);
        });
    }
}
