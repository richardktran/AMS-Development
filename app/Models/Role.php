<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['role_name'];

    public const ADMIN = 1;
    public const STAFF = 2;

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
