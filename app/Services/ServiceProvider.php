<?php

namespace App\Services;

use App\Services\Business\AssetService;
use App\Services\Business\AssignmentService;
use App\Services\Business\AuthService;
use App\Services\Business\UserService;
use App\Services\Contracts\AssetServiceContract;
use App\Services\Business\CategoryService;
use App\Services\Business\ReportService;
use App\Services\Business\ReturningService;
use App\Services\Contracts\AssignmentServiceContract;
use App\Services\Contracts\AuthServiceContract;
use App\Services\Contracts\UserServiceContract;
use App\Services\Contracts\CategoryServiceContract;
use App\Services\Contracts\ReportServiceContract;
use App\Services\Contracts\ReturningServiceContract;
use Illuminate\Support\ServiceProvider as BaseServiceProvider;

class ServiceProvider extends BaseServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(UserServiceContract::class, UserService::class);
        $this->app->bind(AuthServiceContract::class, AuthService::class);
        $this->app->bind(UserServiceContract::class, UserService::class);
        $this->app->bind(CategoryServiceContract::class, CategoryService::class);
        $this->app->bind(AssetServiceContract::class, AssetService::class);
        $this->app->bind(AssignmentServiceContract::class, AssignmentService::class);
        $this->app->bind(ReturningServiceContract::class, ReturningService::class);
        $this->app->bind(ReportServiceContract::class, ReportService::class);
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
