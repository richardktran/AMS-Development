<?php

namespace App\Services\Utils;

use Illuminate\Http\Response;
use Symfony\Component\Routing\Exception\InvalidParameterException;

trait HasStateCheck
{
    public static function makeSureStateIs($model, $states, ?string $message = null): bool
    {
        $states = is_array($states) ? $states : array($states);

        $result = static::multipleCheck($model, function ($model) use ($states) {
            return (in_array($model->state_key, $states));
        });

        if ($result == false) {
            $states_string = implode(', ', array_map('strtolower', $states));

            throw new InvalidParameterException(
                $message ?? "Your selected asset isn't $states_string",
                Response::HTTP_BAD_REQUEST
            );
        }

        return true;
    }

    public static function makeSureStateIsNot($model, $states, ?string $message = null): bool
    {
        $states = is_array($states) ? $states : array($states);

        $is_states = array_diff($model::getAllStates(), $states);

        return static::makeSureStateIs($model, $is_states, $message);
    }
}
