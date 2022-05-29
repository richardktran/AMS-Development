<?php

namespace App\Http\Requests;

use App\Rules\UniqueCaseInsensitive;
use Illuminate\Foundation\Http\FormRequest;

class CategoryStore extends FormRequest
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
            'category_prefix' => ['required',
                'string',
                new UniqueCaseInsensitive('categories', 'category_prefix', 'Prefix')],
            'category_name' => ['required',
                'string',
                new UniqueCaseInsensitive('categories', 'category_name', 'Category')]
        ];
    }
}
