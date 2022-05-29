<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Carbon\Carbon;

class JoinedDateOnWeekend implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $joined_date = Carbon::parse($value);

        $day_of_week = $joined_date->dayOfWeek;

        if ($day_of_week == Carbon::SATURDAY || $day_of_week == Carbon::SUNDAY) {
            return false;
        }

        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Joined date is Saturday or Sunday. Please select a different date';
    }
}
