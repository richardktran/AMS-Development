<?php

namespace App\Services\Utils;

use Illuminate\Http\Response;
use Symfony\Component\Routing\Exception\InvalidParameterException;

class CheckReturning
{
    use HasMultipleCheck;
    use HasStateCheck;
}
