<?php

namespace App\Http\Resources;

use App\Helper\Date;
use Illuminate\Http\Resources\Json\JsonResource;

class AssetResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'asset_code' => $this->asset_code,
            'asset_name' => $this->asset_name,
            'category_id' => $this->category_id,
            'category_name' => $this->category->category_name,
            'specific' => $this->specific,
            'installed_date' => Date::standardizedFormat($this->installed_date),
            'state_key' => $this->state_key,
            'state_name' => $this->state_name,
            'location_id' => $this->location_id,
            'location' => $this->location->location_name
        ];
    }
}
