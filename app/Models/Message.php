<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Message extends Model
{
    use HasFactory;

    public $table = 'message',
           $fillable = ['sender_id', 'receiver_id', 'reply_to_id', 'body', 'read_at', 'unsent_at', 'edited_at'],
           $timestamps = false;

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id', 'id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id', 'id');
    }

    public function replyTo()
    {
        return $this->belongsTo(Message::class, 'reply_to_id', 'id');
    }

    public function edits()
    {
        return $this->hasMany(MessageEdit::class, 'message_id', 'id')->orderBy('created_at');
    }
}
