<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Returning extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'assignment_id',
        'requested_by',
        'accepted_by',
        'returned_date',
        'state_key',
    ];

    protected $casts = [
        'returned_date' => 'datetime'
    ];

    public const COMPLETED = 'COMPLETED';
    public const WAITING_FOR_RETURNING = 'WAITING_FOR_RETURNING';

    public const STATE_NAMES = [
        self::COMPLETED => 'Completed',
        self::WAITING_FOR_RETURNING => 'Waiting for returning',
    ];

    protected $attributes = [
        'state_key' => self::WAITING_FOR_RETURNING,
    ];

    public function getStateNameAttribute()
    {
        return static::STATE_NAMES[$this->state_key];
    }

    public static function getAllStates()
    {
        return array_keys(static::STATE_NAMES);
    }

    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    public function requestedByUser()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function acceptedByUser()
    {
        return $this->belongsTo(User::class, 'accepted_by');
    }
}
