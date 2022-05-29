<?php

namespace App\Http\Requests;

use App\Rules\AfterOrEqualMultiDate;
use App\Services\Contracts\AssetServiceContract;
use App\Services\Contracts\UserServiceContract;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class AssignmentStoreRequest extends FormRequest
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
    public function rules(AssetServiceContract $assetService, UserServiceContract $userService)
    {
        $assigned_to = $userService->find($this->assigned_to);
        $joined_date = $assigned_to->joined_date;

        $asset = $assetService->find($this->asset_id);
        $asset_installed_date = $asset->installed_date;

        return [
            'assigned_to' => 'integer|required|exists:users,id',
            'asset_id' => 'integer|required|exists:assets,id',
            'assign_date' => [
                'required',
                'date',
                new AfterOrEqualMultiDate([
                    'user joined date' => $joined_date,
                    'asset installed date' => $asset_installed_date,
                    'today' => Carbon::today()
                ])
            ],
            'assign_note' => 'string|required'
        ];
    }
}
