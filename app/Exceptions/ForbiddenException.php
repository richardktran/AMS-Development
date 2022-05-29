<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\Response;

class ForbiddenException extends Exception
{
    public function render()
    {
        return response()->json([
            'message' => $this->getMessage()
        ], Response::HTTP_FORBIDDEN);
    }
}
