<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Assignment extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'asset_id',
        'assign_date',
        'assign_note',
        'assigned_to',
        'assigned_by',
        'state_key',
        'location_id',
    ];

    protected $casts = [
        'assign_date' => 'datetime'
    ];

    protected $with = [
        'asset',
        'assignedByUser',
        'assignedToUser',
    ];

    public const ACCEPTED = 'ACCEPTED';
    public const DECLINED = 'DECLINED';
    public const WAITING_FOR_ACCEPTANCE = 'WAITING_FOR_ACCEPTANCE';
    public const WAITING_FOR_RETURNING = 'WAITING_FOR_RETURNING';
    public const COMPLETED = 'COMPLETED';

    public const STATE_NAMES = [
        self::ACCEPTED => 'Accepted',
        self::DECLINED => 'Declined',
        self::WAITING_FOR_ACCEPTANCE => 'Waiting for acceptance',
        self::WAITING_FOR_RETURNING => 'Waiting for returning',
        self::COMPLETED => 'Completed',
    ];

    protected $attributes = [
        'state_key' => self::WAITING_FOR_ACCEPTANCE
    ];

    public static function getAllStates()
    {
        return array_keys(static::STATE_NAMES);
    }

    public static function getUserOwnStates()
    {
        return [
            self::WAITING_FOR_ACCEPTANCE,
            self::ACCEPTED,
        ];
    }

    public static function getResponseStates()
    {
        return [
            self::ACCEPTED,
            self::DECLINED
        ];
    }

    public static function getCanDeleteStates()
    {
        return [
            self::WAITING_FOR_ACCEPTANCE,
            self::DECLINED,
            self::WAITING_FOR_RETURNING
        ];
    }

    public static function getStatesDisplayOnHome()
    {
        return [
            self::WAITING_FOR_ACCEPTANCE,
            self::ACCEPTED,
            self::WAITING_FOR_RETURNING
        ];
    }

    public function getStateNameAttribute()
    {
        return static::STATE_NAMES[$this->state_key];
    }

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    public function assignedByUser()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function assignedToUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function returning()
    {
        return $this->hasOne(Returning::class);
    }
}
