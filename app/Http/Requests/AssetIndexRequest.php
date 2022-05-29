<?php

namespace App\Http\Requests;

use App\Models\Asset;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class AssetIndexRequest extends FormRequest
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
                Rule::in(Asset::getAllStates())
            ],
            'categories' => ['nullable', 'array'],
            'categories.*' => [
                'exists:categories,id'
            ],
            'sort_type' => [
                'nullable',
                Rule::in([
                    'asset_code',
                    'asset_name',
                    'category_name',
                    'state_name',
                ])
            ],
            'sort_value' => ['nullable', Rule::in(['asc', 'desc'])],
            'search' => 'nullable',
            'per_page' => 'nullable|integer',
            'meta' => 'nullable',
        ];
    }
}
