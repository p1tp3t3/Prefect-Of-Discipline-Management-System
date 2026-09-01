<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserPermission extends Model
{
    use HasFactory;

    public $table = 'user_permissions',
           $fillable = [
               'user_id',
               'allow_complaint',
               'allow_referral',
               'allow_absent_form',
               'allow_appointment',
               'allow_gatepass',
           ],
           $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
