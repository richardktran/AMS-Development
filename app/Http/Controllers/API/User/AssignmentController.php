<?php

namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\MyAssignmentIndexRequest;
use App\Http\Resources\AssignmentResource;
use App\Services\Contracts\AssignmentServiceContract;
use Nyholm\Psr7\Request;
use App\Http\Requests\ResponseAssignmentRequest;
use Illuminate\Http\Response;

class AssignmentController extends Controller
{
    protected $assignmentService;

    public function __construct(AssignmentServiceContract $assignmentService)
    {
        $this->assignmentService = $assignmentService;
    }

    public function index(MyAssignmentIndexRequest $request)
    {
        $conditions = $request->validated();

        $assignments = $this->assignmentService->myAssignments($conditions);

        return AssignmentResource::collection($assignments);
    }

    public function update(ResponseAssignmentRequest $request, $assignment_id)
    {
        $data = $request->validated();

        $assignment = $this->assignmentService->find($assignment_id);

        $this->assignmentService->response($assignment, $data);

        return response([
            'message' => 'Responsed assignment successfully'
        ], Response::HTTP_OK);
    }
}
