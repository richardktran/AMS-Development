<?php

namespace App\Http\Resources;

use App\Helper\Date;
use Illuminate\Http\Resources\Json\JsonResource;

class ReturningResource extends JsonResource
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
            'asset_code' => $this->assignment->asset->asset_code,
            'asset_name' => $this->assignment->asset->asset_name,
            'assignment_id' => $this->assignment_id,
            'requested_by' => $this->requested_by,
            'requested_by_username' => $this->requestedByUser->username,
            'accepted_by' => $this->accepted_by,
            'accepted_by_username' => $this->acceptedByUser !== null
                ? $this->acceptedByUser->username
                : '',
            'assign_date' => Date::standardizedFormat($this->assignment->assign_date),
            'returned_date' => $this->returned_date !== null
                ? Date::standardizedFormat($this->returned_date)
                : '',
            'state_key' => $this->state_key,
            'state_name' => $this->state_name,
        ];
    }
}
