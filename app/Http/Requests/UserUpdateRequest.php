<?php

namespace App\Http\Requests;

use App\Rules\JoinedDateOnWeekend;
use App\Rules\Under18;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'birthday' => ['required', 'date', new Under18()],
            'joined_date' => [
                'required', 'date', 'after:birthday',
                new JoinedDateOnWeekend()
            ],
            'role_id' => ['required', 'integer', Rule::in([1, 2]),],
            'gender' => ['required', 'string', Rule::in(['Female', "Male"])]
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'joined_date.before' => 'Joined date is not later than Date of Birth. Please select a different date'
        ];
    }
}
