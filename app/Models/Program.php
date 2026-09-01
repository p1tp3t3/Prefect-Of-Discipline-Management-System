<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Program extends Model
{
    use HasFactory;

    public $table = 'program',
           $fillable = ['name', 'description', 'logo', 'color_code', 'is_deleted'];
    public $timestamps = false;


    public function teachingStaff() {
        return $this->hasMany(TeachingStaff::class, 'program_id', 'id');
    }
    public function programHead() {
        return $this->hasOne(TeachingStaff::class, 'program_id', 'id')->where('position', 'program_head');
    }
    public function enrollments() {
        return $this->hasMany(Enrollment::class, 'program_id', 'id');
    }
}
