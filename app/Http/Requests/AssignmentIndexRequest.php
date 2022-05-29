<?php

namespace App\Http\Requests;

use App\Models\Assignment;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class AssignmentIndexRequest extends FormRequest
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
                Rule::in(Assignment::getAllStates())
            ],
            'date' => [
                'nullable',
                'date'
            ],
            'sort_type' => [
                'nullable',
                Rule::in([
                    'asset_code',
                    'asset_name',
                    'assign_date',
                    'id',
                    'to_username',
                    'by_username',
                    'state_name',
                ])
            ],
            'sort_value' => ['nullable', Rule::in(['asc', 'desc'])],
            'search' => 'nullable',
            'per_page' => ['nullable', 'integer']
        ];
    }
}
