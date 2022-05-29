<?php

namespace App\Services\Utils;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Response;
use ReflectionClass;
use Symfony\Component\Routing\Exception\InvalidParameterException;

class CheckLocation
{
    protected static $column = 'location_id';

    /**
     * @param Model|Model[] $models
     * @param string|null $column
     */
    public static function makeCheck($models, ?string $column = null)
    {
        $models = $models instanceof Model ? [$models] : $models;

        $location_column = $column ?? static::$column;

        $invalid_models = [];

        foreach ($models as $model) {
            if (request()->user()->location_id != $model->{$location_column}) {
                $class_name = static::getClassName($model);
                $invalid_models[] = $class_name;
            }
        }

        if (count($invalid_models) > 0) {
            $name_string = implode(', ', $invalid_models);
            throw new InvalidParameterException(
                "$name_string are not belongs to your location",
                Response::HTTP_FORBIDDEN
            );
        }
    }

    private static function getClassName($object): string
    {
        return (new ReflectionClass($object))->getShortName();
    }
}
