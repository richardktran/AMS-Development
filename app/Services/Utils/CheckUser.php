<?php

namespace App\Services\Utils;

use Illuminate\Http\Response;
use Symfony\Component\Routing\Exception\InvalidParameterException;

class CheckUser
{
    public static function makeSureNotIsMyself($user)
    {
        if ($user->id == request()->user()->id) {
            throw new InvalidParameterException(
                "You can't assign assignment to yourself",
                Response::HTTP_BAD_REQUEST
            );
        }
    }
}
