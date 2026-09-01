<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Profile extends Model
{
    use HasFactory;

    public $table = 'profiles',
           $fillable = [
               'user_id',
               'first_name',
               'middle_name',
               'last_name',
               'profile_picture',
               'sex',
               'date_of_birth',
               'civil_status',
               'religion',
               'citizenship',
               'current_address',
               'permanent_address',
               'place_of_birth',
               'contact_number',
           ],
           $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
