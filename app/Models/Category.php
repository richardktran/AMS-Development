<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['category_prefix', 'category_name', 'location_id'];

    public function assets()
    {
        return $this->hasMany(Asset::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
