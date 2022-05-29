<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\AuthLoginRequest;
use App\Http\Requests\ChangePasswordRequest;
use App\Services\Contracts\AuthServiceContract;
use App\Http\Requests\ResetMustChangePasswordRequest;
use App\Services\Contracts\UserServiceContract;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthServiceContract $authService)
    {
        $this->authService = $authService;
    }

    public function login(AuthLoginRequest $request)
    {
        $validated_request = $request->validated();

        $token = $this->authService->login($validated_request);

        return response(['user' => new UserResource(auth()->user()), 'access_token' => $token]);
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return response([
        'message' => 'Logout successfully'
        ], Response::HTTP_OK);
    }

    public function updateAuthUser(ChangePasswordRequest $request)
    {
        $data = $request->validated();

        $new_password = $data['new_password'];
        $old_password = $data['old_password'] ?? '';

        $user = $this->authService->changePassword($new_password, $old_password);

        return response([
            'message' => 'Your password has been changed successfully',
            'user' => $user
        ], 200);
    }

    public function getAuthUser()
    {
        return $this->authService->getAuthUser();
    }


    public function resetMustChangePassword(ResetMustChangePasswordRequest $request)
    {
        $user = User::where('username', $request->username);

        try {
            $user->update(['must_change_password' => true]);
            return response('Update successfully', 200);
        } catch (\Throwable $th) {
            return response('Update failed', 500);
        }
    }
}
