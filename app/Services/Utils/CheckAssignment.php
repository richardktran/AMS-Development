<?php

namespace App\Services\Utils;

use App\Exceptions\BadRequestException;

class CheckAssignment
{
    use HasMultipleCheck;
    use HasStateCheck;

    public static function makeSureOwnAssignment($assign)
    {
        if ($assign->assigned_to != request()->user()->id) {
            throw new BadRequestException("You can't respone assignment not belongs yourself");
        }
    }
}
