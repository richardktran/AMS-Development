<?php

namespace App\Http\Resources;

use App\Helper\Date;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
      'staff_code' => $this->staff_code,
      'full_name' => $this->full_name,
      'username' => $this->username,
      'birthday' => Date::standardizedFormat($this->birthday),
      'gender' => $this->gender,
      'must_change_password' => $this->must_change_password,
      'joined_date' => Date::standardizedFormat($this->joined_date),
      'type' => $this->role->role_name,
      'role_id' => $this->role_id,
      'location' => $this->location->location_name
    ];
  }
}
