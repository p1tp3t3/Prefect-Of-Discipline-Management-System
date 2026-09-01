<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Violation extends Model
{
    use HasFactory;

    public $table = 'violation',
           $fillable = ['id', 'violation_name', 'offense_status'];
    public $timestamps = false;
    
    public function penalties() {
        return $this->hasMany(ViolationPenalty::class, 'violation_id');
    }
}
