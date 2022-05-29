<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserIndexRequest extends FormRequest
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
            'filter' => 'nullable|array|exists:roles,id',
            'sort_type' => [
                'nullable',
                Rule::in([
                    'staff_code',
                    'full_name',
                    'username',
                    'joined_date',
                    'type',
                ])
            ],
            'sort_value' => ['nullable', Rule::in(['asc', 'desc'])],
            'search' => 'nullable',
            'per_page' => 'nullable|integer',
        ];
    }

    public function messages()
    {
        return [
            'filter.exists' => 'Selected role is not exists'
        ];
    }
}
