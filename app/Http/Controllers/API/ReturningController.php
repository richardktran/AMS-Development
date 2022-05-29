<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReturningIndexRequest;
use App\Http\Resources\ReturningResource;
use App\Models\Assignment;
use App\Services\Contracts\ReturningServiceContract;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Requests\ReturningUpdateRequest;
use App\Models\Returning;

class ReturningController extends Controller
{
    protected $returningService;

    public function __construct(ReturningServiceContract $returningService)
    {
        $this->returningService = $returningService;
    }

    public function index(ReturningIndexRequest $request)
    {
        $conditions = $request->validated();
        $returns = $this->returningService->index($conditions);
        return ReturningResource::collection($returns);
    }

    public function getStates()
    {
        $states = $this->returningService->getAllStates();

        return response([
            'states' => $states
        ], Response::HTTP_OK);
    }

    public function store(Assignment $assignment)
    {
        $return = $this->returningService->store($assignment);

        return response([
            'message' => 'Create returning request successfully',
            'returning' => new ReturningResource($return)
        ], Response::HTTP_CREATED);
    }

    public function update(ReturningUpdateRequest $request, Returning $returning)
    {
        $request->validated();

        $this->returningService->complete($returning);

        return response([
            'message' => 'Response returning successfully'
        ]);
    }

    public function destroy(Returning $returning)
    {
        $this->returningService->cancel($returning);

        return response([
            'message' => 'Cancel request returning successfully'
        ], Response::HTTP_OK);
    }
}
