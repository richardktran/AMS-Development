<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class ReportIndexRequest extends FormRequest
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
            'sort_type' => [
                'nullable',
                Rule::in([
                    'id',
                    'category_name',
                    'total',
                    'available',
                    'not_available',
                    'assigned',
                    'waiting_for_recycling',
                    'recycled'
                ])
            ],
            'sort_value' => ['nullable', Rule::in(['asc', 'desc'])],
            'per_page' => ['nullable', 'integer']
        ];
    }
}
