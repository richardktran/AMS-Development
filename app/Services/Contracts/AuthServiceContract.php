<?php

namespace App\Services\Contracts;

interface AuthServiceContract
{
    public function login($data);

    public function logout($user);

    public function changePassword($new_password, $old_password);

    public function getAuthUser();
}
