<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageEdit extends Model
{
    public $table = 'message_edit',
           $fillable = ['message_id', 'body'],
           $timestamps = false;

    public function message()
    {
        return $this->belongsTo(Message::class, 'message_id', 'id');
    }
}
