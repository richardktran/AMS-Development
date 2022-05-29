<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Rules\LatinName;
use App\Models\Asset;

class AssetUpdateRequest extends FormRequest
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
                Rule::in(Asset::getUpdateRequestStates())
            ]
        ];
    }
}
