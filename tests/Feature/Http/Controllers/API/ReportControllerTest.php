<?php

namespace Tests\Feature\Http\Controllers\API;

use App\Exports\ReportExport;
use App\Models\Asset;
use App\Models\Category;
use App\Models\Location;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Passport\Passport;
use Maatwebsite\Excel\Facades\Excel;
use Tests\TestCase;

class ReportControllerTest extends TestCase
{
    use WithFaker;

    protected $location;
    protected $admin;
    protected $category;
    protected $assets;

    public function setUp(): void
    {
        parent::setUp();

        $this->location = Location::factory()->create();
        $this->category = Category::factory()->for($this->location)->create();
        $this->admin = User::factory()->for($this->location)->create();
        $this->assets = Asset::factory()->count(20)
            ->for($this->location)
            ->for($this->category)
            ->create();

        Passport::actingAs($this->admin, ['admin']);
    }

    public function test_index_report()
    {
        $response = $this->getJson('/api/reports');

        $response->assertStatus(200);

        $response->assertJson(function (AssertableJson $json) {
            $json
                ->where('data.0.id', $this->category->id)
                ->where('data.0.category_name', $this->category->category_name)
                ->where('data.0.total', strval(20))
                ->where('data.0.AVAILABLE', strval($this->assets->where('state_key', 'AVAILABLE')->count()))
                ->where('data.0.ASSIGNED', strval($this->assets->where('state_key', 'ASSIGNED')->count()))
                ->where('data.0.NOT_AVAILABLE', strval($this->assets->where('state_key', 'NOT_AVAILABLE')->count()))
                ->where('data.0.WAITING_FOR_RECYCLING', strval($this->assets->where('state_key', 'WAITING_FOR_RECYCLING')->count()))
                ->where('data.0.RECYCLED', strval($this->assets->where('state_key', 'RECYCLED')->count()))
                ->etc();
        });
    }

    public function test_staff_can_not_export()
    {
        $staff = User::factory()->for($this->location)->create();
        Passport::actingAs($staff, ['staff']);

        $response = $this->getJson('/api/reports/export');
        $response->assertStatus(403);
    }

    public function test_admin_can_export()
    {
        Passport::actingAs($this->admin, ['admin']);

        $response = $this->getJson('/api/reports/export');
        $currentDate = Carbon::today()->format('d_m_Y');
        $fileName = 'Report_AssetManagement_' . $currentDate . '.xlsx';

        $response->assertDownload($fileName);
    }
}
