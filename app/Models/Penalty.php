<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Penalty extends Model
{
    use HasFactory;

    public $table = 'penalty',
           $fillable = ['ref_number', 'name', 'description'];
    public $timestamps = false;

    protected $casts = [
        'id' => 'string',
    ];
}
