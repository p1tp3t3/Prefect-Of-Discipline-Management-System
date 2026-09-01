<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admission extends Model
{
    public $table = 'admission',
           $fillable = ['student_id', 'confirmed'],
           $timestamps = false;

    public function user() {
        return $this->belongsTo(User::class, 'student_id', 'user_id');
    }
    public function admissionReason() {
        return $this->hasMany(AdmisionReason::class, 'admission_id', 'id');
    }
}
