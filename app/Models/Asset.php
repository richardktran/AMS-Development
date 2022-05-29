<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Asset extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'asset_code',
        'asset_name',
        'category_id',
        'specific',
        'installed_date',
        'state_key',
        'location_id',
    ];

    protected $casts = [
        'installed_date' => 'datetime'
    ];

    protected $with = [
        'location',
        'category'
    ];

    public const ASSIGNED = 'ASSIGNED';
    public const AVAILABLE = 'AVAILABLE';
    public const NOT_AVAILABLE = 'NOT_AVAILABLE';
    public const WAITING_FOR_RECYCLING = 'WAITING_FOR_RECYCLING';
    public const RECYCLED = 'RECYCLED';

    public const STATE_NAMES = [
        self::AVAILABLE => 'Available',
        self::NOT_AVAILABLE => 'Not Available',
        self::ASSIGNED => 'Assigned',
        self::WAITING_FOR_RECYCLING => 'Waiting for recycling',
        self::RECYCLED => 'Recycled',
    ];

    public static function getAllStates()
    {
        return array_keys(static::STATE_NAMES);
    }

    public static function getUpdateRequestStates()
    {
        return [
            self::AVAILABLE,
            self::NOT_AVAILABLE,
            self::WAITING_FOR_RECYCLING,
            self::RECYCLED,
        ];
    }

    public static function getStoreRequestStates()
    {
        return [
            self::AVAILABLE,
            self::NOT_AVAILABLE,
        ];
    }

    public function getStateNameAttribute()
    {
        return static::STATE_NAMES[$this->state_key];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }
}
