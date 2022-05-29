<?php

namespace App\Helper;

class Str
{
    /*
     * Remove double space in string
     */
    public static function standardizedString($string): string
    {
        return (trim(preg_replace("/\s+/", ' ', $string)));
    }
}
