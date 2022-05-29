<?php

namespace App\Services\Business;

use App\Services\Contracts\AuthServiceContract;
use App\Services\Contracts\UserServiceContract;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Exception\InvalidParameterException;

class AuthService implements AuthServiceContract
{
    public function __construct(UserServiceContract $userService)
    {
        $this->userService = $userService;
    }

    public function login($data)
    {
        if (!Auth::attempt($data)) {
            throw new InvalidParameterException(
                'Username or password is incorrect. Please try again',
                Response::HTTP_UNAUTHORIZED
            );
        }

        $user = Auth::user();
        $userRole = $user->role()->first();

        if ($userRole) {
            $this->scope = $userRole->role_name;
        }

        $token = auth()->user()->createToken($user->username . '-' . now(), [$this->scope])->accessToken;

        return $token;
    }

    public function logout($user)
    {
        if (!$user->token()->revoke()) {
            throw new InvalidParameterException('Logout unsuccessfully', Response::HTTP_BAD_REQUEST);
        }

        return true;
    }

    public function changePassword($new_password, $old_password)
    {
        $user = request()->user();

        if (Hash::check($new_password, $user->password)) {
            throw new InvalidParameterException(
                'New password must be different',
                Response::HTTP_BAD_REQUEST
            );
        }

        if (!$user->must_change_password && !Hash::check($old_password, $user->password)) {
            throw new InvalidParameterException(
                'Password is incorrect',
                Response::HTTP_BAD_REQUEST
            );
        }

        $this->userService->update($user, [
            'password' => $new_password,
            'must_change_password' => false
        ]);

        return $user;
    }

    public function getAuthUser()
    {
        return $this->userService->show(request()->user());
    }
}
