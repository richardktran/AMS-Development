<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory;
    use Notifiable;
    use SoftDeletes;
    use HasApiTokens;

    protected $fillable = [
        'staff_code',
        'first_name',
        'last_name',
        'username',
        'base_username',
        'password',
        'birthday',
        'joined_date',
        'location_id',
        'role_id',
        'must_change_password',
        'gender'
    ];

    protected $hidden = [
        'password',
        'deleted_at',
    ];

    public function scopeGetPassword()
    {
        var_dump($this->makeVisible('password'));
    }

    protected $casts = [
        'birthday' => 'datetime',
        'joined_date' => 'datetime',
        'must_change_password' => 'boolean',
    ];

    protected $with = [
        'location',
        'role'
    ];

    protected $attributes = [
        'must_change_password' => true
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . (($this->last_name != null) ? ' ' . $this->last_name : "");
    }

    public function createdAssignments()
    {
        return $this->hasMany(Assignment::class, 'assigned_by');
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'assigned_to');
    }

    public function availableAssignments()
    {
        return $this->hasMany(Assignment::class, 'assigned_to')->whereIn('state_key', Assignment::getUserOwnStates());
    }

    public function requestedReturnings()
    {
        return $this->hasMany(Returning::class, 'requested_by');
    }

    public function acceptedReturnings()
    {
        return $this->hasMany(Returning::class, 'accepted_by');
    }

    public function getIsAdminAttribute()
    {
        return ($this->role_id == Role::ADMIN);
    }
}
