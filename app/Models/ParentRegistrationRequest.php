<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParentRegistrationRequest extends Model
{
    public $table = 'parent_registration_request',
           $fillable = ['name', 'email', 'parent_details'],
           $timestamps = false;
}
