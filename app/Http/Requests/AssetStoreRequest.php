<?php

namespace App\Http\Requests;

use App\Models\Asset;
use App\Rules\LatinName;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssetStoreRequest extends FormRequest
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
            'asset_name' => ['string', 'required', new LatinName()],
            'specific' => 'string|required',
            'installed_date' => 'date|required',
            'state_key' => [
                'string', 'required',
                Rule::in(Asset::getStoreRequestStates())
            ],
            'category_id' => 'integer|required|exists:categories,id'
        ];
    }
}
