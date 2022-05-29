<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\Response;

class BadRequestException extends Exception
{
    public function render()
    {
        return response()->json([
            'message' => $this->getMessage()
        ], Response::HTTP_BAD_REQUEST);
    }
}
