<?php

namespace App\Services\Utils;

use Illuminate\Database\Eloquent\Model;

trait HasMultipleCheck
{
    public static function multipleCheck($models, callable $callbacks): bool
    {
        $models =  $models instanceof Model ? [$models] : $models;

        foreach ($models as $model) {
            if ($callbacks($model) == false) {
                return false;
            }
        }

        return true;
    }
}
