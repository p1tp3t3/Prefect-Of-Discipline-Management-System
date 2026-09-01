<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReferralReferredStudent extends Model
{
    use HasFactory;

    public $table = 'referral_referred_student',
           $fillable = ['referral_id', 'student_id'],
           $timestamps = false;

    public function referral() {
        return $this->belongsTo(Referral::class, 'referral_id', 'id');
    }
    public function user() {
        return $this->belongsTo(User::class, 'student_id', 'id');
    }
}
