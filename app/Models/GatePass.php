<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GatePass extends Model
{
    use HasFactory;

    public $table = 'gate_pass',
           $fillable = ['user_id', 'reason', 'allow_to', 'confirmed_at', 'date_expiration'],
           $timestamps = false;

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
