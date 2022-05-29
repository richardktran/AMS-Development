<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserStoreRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\Contracts\UserServiceContract;
use App\Http\Requests\UserIndexRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Requests\UserUpdateRequest;
use Carbon\Carbon;
use Throwable;
use Symfony\Component\Routing\Exception\InvalidParameterException;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserServiceContract $userService)
    {
        $this->userService = $userService;
    }

    public function index(UserIndexRequest $request)
    {
        $conditions = $request->validated();

        $users = $this->userService->index($conditions);

        return UserResource::collection($users);
    }

    public function show(User $user)
    {
        $user = $this->userService->show($user);

        return response([
            'user' => new UserResource($user)
        ], Response::HTTP_OK);
    }

    public function update(UserUpdateRequest $request, User $user)
    {
        $data = $request->validated();

        $this->userService->update($user, $data);
        $is_update_assignment = $this->userService->isUpdatedAssignment();

        return response([
            'message' => 'Edited user successfully',
            'notify' => $is_update_assignment
                ? 'Some assignments will be update to ' . Carbon::parse($data['joined_date'])->format('d/m/Y')
                : null,
            'user' => new UserResource($user)
        ], Response::HTTP_OK);
    }

    public function store(UserStoreRequest $request)
    {
        $validated_request = $request->validated();
        $location_id = $request->user()->location_id;

        $user = $this->userService->store(array_merge(
            $validated_request,
            ["location_id" => $location_id]
        ));

        return response([
            'message' => 'Created user successfully',
            'user' => new UserResource($user)
        ], Response::HTTP_CREATED);
    }

    public function destroy(User $user)
    {
        $user = $this->userService->disableUser($user);

        return response([
            'message' => 'User is disabled successfully.',
            'user' => new UserResource($user),
        ], Response::HTTP_OK);
    }

    public function restoreUser($username)
    {
        try {
            User::withTrashed()
            ->where('username', $username)
            ->restore();
        } catch (Throwable $th) {
            throw new InvalidParameterException(
                'This user could not be found',
                Response::HTTP_NOT_FOUND
            );
        }

        return response([
            'message' => 'User is restored successfully.',
        ], Response::HTTP_OK);
    }

    public function isAnyValidAssignment(User $user)
    {
        $valid = $this->userService->isUserCanDisable($user);

        if ($valid == false) {
            return response([
                'message' => 'There are valid assignments belonging to this user!',
            ], Response::HTTP_BAD_REQUEST);
        }

        return response([
            'message' => 'There is no valid assignment.',
        ], Response::HTTP_OK);
    }
}
