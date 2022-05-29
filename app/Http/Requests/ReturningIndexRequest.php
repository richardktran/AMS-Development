<?php

namespace App\Http\Requests;

use App\Models\Returning;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class ReturningIndexRequest extends FormRequest
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
            'states' => [
                'nullable',
                'array',

            ],
            'states.*' => [
                'string',
                Rule::in(Returning::getAllStates())
            ],
            'date' => [
                'nullable',
                'date'
            ],
            'sort_type' => [
                'nullable',
                Rule::in([
                    'id',
                    'asset_code',
                    'asset_name',
                    'requested_by_username',
                    'accepted_by_username',
                    'assign_date',
                    'returned_date',
                    'state_name',
                ])
            ],
            'sort_value' => ['nullable', Rule::in(['asc', 'desc'])],
            'search' => 'nullable',
            'per_page' => ['nullable', 'integer']
        ];
    }
}
