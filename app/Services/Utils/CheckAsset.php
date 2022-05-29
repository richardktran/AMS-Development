<?php

namespace App\Services\Utils;

use Illuminate\Http\Response;
use Symfony\Component\Routing\Exception\InvalidParameterException;

class CheckAsset
{
    use HasMultipleCheck;
    use HasStateCheck;

    public static function makeSureNeverHasAssign($assets, ?string $message = null): bool
    {
        $result = static::multipleCheck($assets, function ($asset) {
            return (! $asset->assignments()->exists());
        });

        if ($result == false) {
            throw new InvalidParameterException(
                $message,
                Response::HTTP_BAD_REQUEST
            );
        }

        return true;
    }
}
