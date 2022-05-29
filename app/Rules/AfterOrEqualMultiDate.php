<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Carbon;

class AfterOrEqualMultiDate implements Rule
{
    protected $rules;
    protected $error_date;
    protected $error_field;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($rules)
    {
        $this->rules = $rules;
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
        $dates = $this->rules;

        $input_date = Carbon::parse($value);
        $mostRecent = $input_date->clone();

        foreach ($dates as $field => $date) {
            if ($date->gte($mostRecent)) {
                $mostRecent = $date;
                $this->error_field = $field;
                $this->error_date = $date;
            }
        }

        return $mostRecent->lte($input_date);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        $date = $this->error_date->format('d/m/Y');

        return 'The :attribute must be after or equal ' . $this->error_field . ' ' . $date;
    }
}
