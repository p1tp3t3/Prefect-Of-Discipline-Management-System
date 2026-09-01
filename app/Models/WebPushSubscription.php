<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebPushSubscription extends Model
{
    public $fillable = ['user_id', 'endpoint', 'public_key', 'auth'],
           $table = 'webpush_subscription',
           $timestamps = false;

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
