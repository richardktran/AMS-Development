<?php

namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReturningResource;
use App\Models\Assignment;
use App\Services\Contracts\ReturningServiceContract;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ReturningController extends Controller
{
    protected $returningService;

    public function __construct(ReturningServiceContract $returningService)
    {
        $this->returningService = $returningService;
    }

    public function store(Assignment $assignment)
    {
        $return = $this->returningService->store($assignment);

        return response([
            'message' => 'Create returning request successfully',
            'returning' => new ReturningResource($return)
        ], Response::HTTP_CREATED);
    }
}
