<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    public $table = 'appointment',
           $fillable = ['user_id', 'date_time_appoint', 'appointment_status', 'rejected_reason', 'confirmed_at', 'description'],
           $timestamps = false;

    protected $casts = [
        'date_time_appoint' => 'datetime',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
