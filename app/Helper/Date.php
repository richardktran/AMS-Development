<?php

namespace App\Helper;

use Illuminate\Support\Carbon;

class Date
{
    public static function standardizedFormat($date)
    {
        return Carbon::parse($date)->toDateString();
    }
}
