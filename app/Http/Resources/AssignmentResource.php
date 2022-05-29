<?php

namespace App\Http\Resources;
use App\Helper\Date;
use Illuminate\Http\Resources\Json\JsonResource;

class AssignmentResource extends JsonResource
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
            'asset_id' => $this->asset->id,
            'asset_code' => $this->asset->asset_code,
            'asset_name' => $this->asset->asset_name,
            'asset_installed_date' => $this->asset->installed_date,
            'specification' =>$this->asset->specific,
            'assign_date' => Date::standardizedFormat($this->assign_date),
            'assign_note' => $this->assign_note,
            'assigned_to' => $this->assignedToUser->id,
            'to_username' => $this->assignedToUser->username,
            'to_staff_code' => $this->assignedToUser->staff_code,
            'to_full_name' => $this->assignedToUser->full_name,
            'assigned_by' => $this->assigned_by,
            'by_username' => $this->assignedByUser->username,
            'state_key' => $this->state_key,
            'state_name' => $this->state_name,
            'category_name' => $this->asset->category->category_name,
        ];
    }
}
