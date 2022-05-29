<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\DB;

class UniqueCaseInsensitive implements Rule
{
    protected $table;
    protected $column;
    protected $name;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($table, $column, $name = null)
    {
        $this->table = $table;
        $this->column = $column;
        $this->name = $name;
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
        $search_string = strtoupper($value);

        return DB::table($this->table)->where(DB::raw("UPPER($this->column)"), $search_string)->doesntExist();
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        $name = strtolower($this->name ?? ':attribute');

        return ucfirst($name) . " is already existed. Please enter a different $name.";
    }
}
