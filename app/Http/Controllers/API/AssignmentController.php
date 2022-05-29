<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssignmentIndexRequest;
use App\Http\Requests\AssignmentUpdateRequest;
use App\Http\Requests\AssignmentStoreRequest;
use App\Http\Resources\AssignmentResource;
use App\Models\Assignment;
use App\Services\Contracts\AssignmentServiceContract;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AssignmentController extends Controller
{
    protected $assignmentService;

    public function __construct(AssignmentServiceContract $assignmentService)
    {
        $this->assignmentService = $assignmentService;
    }

    public function store(AssignmentStoreRequest $request)
    {
        $validated_request = $request->validated();
        $admin = $request->user();

        $assignment = $this->assignmentService->store(array_merge(
            $validated_request,
            [
                'location_id' => $admin->location_id,
                'assigned_by' => $admin->id
            ]
        ));

        return response([
            'message' => 'Created assignment successfully',
            'assignment' => new AssignmentResource($assignment)
        ], Response::HTTP_CREATED);
    }

    public function index(AssignmentIndexRequest $request)
    {
        $conditions = $request->validated();

        $assignments = $this->assignmentService->index($conditions);

        return AssignmentResource::collection($assignments);
    }

    public function show(Assignment $assignment)
    {
        $assignment = $this->assignmentService->show($assignment);

        return response([
            'assignment' => new AssignmentResource($assignment)
        ], Response::HTTP_OK);
    }

    public function getStates()
    {
        $states = $this->assignmentService->getAllStates();

        return response([
            'states' => $states
        ], Response::HTTP_OK);
    }

    public function update(AssignmentUpdateRequest $request, Assignment $assignment)
    {
        $data = $request->validated();
        $this->assignmentService->update($assignment, $data);

        $is_updated_assign_date = $this->assignmentService->isUpdatedAssignDate();
        $max_date = $this->assignmentService->getMaxDate();

        return response([
            'message' => 'Edited assignment successfully',
            'notify' => $is_updated_assign_date
                ? 'Assign date will be updated to ' . $max_date->format('d/m/Y')
                : null,
            'assignment' => new AssignmentResource($assignment)
        ], Response::HTTP_OK);
    }

    public function destroy(Assignment $assignment)
    {
        $this->assignmentService->destroy($assignment);

        return response([
            'message' => 'Deleted assignment successfully'
        ], Response::HTTP_OK);
    }
}
