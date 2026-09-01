<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppointmentRequest extends Model
{
    public $table = 'appointment_request',
           $fillable = [
               'user_id', 
               'appointment_id', 
               'request_type', 
               'date_time_appoint', 
               'description', 
               'confirmed'
            ], 
            $timestamps = false;
    
    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
    public function appointment() {
        return $this->belongsTo(Appointment::class, 'appointment_id', 'id');
    }
}
