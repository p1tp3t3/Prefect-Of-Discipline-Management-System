<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppointmentSlot extends Model
{
    public $table = 'appointment_slot', $fillable = ['date_available', 'maximum_slots'];

    public function appointment() {
        return $this->hasMany(Appointment::class, 'appointment_slot_id', 'id');
    }
}
