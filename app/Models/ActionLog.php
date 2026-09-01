<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActionLog extends Model
{
    const UPDATED_AT = null;
    public $timestamps = false;

    public $fillable = ['user_id', 'action_type', 'details'],
           $table = 'action_log';
    
    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
