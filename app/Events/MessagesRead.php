<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Tells the original sender (broadcast on their own chat.{id} channel)
 * that $readerId has just read everything they'd sent them — the
 * Messenger-style "Seen" receipt.
 */
class MessagesRead implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public $queue = 'notification';

    public function __construct(private int $senderId, private int $readerId, private string $readAt)
    {
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("chat.{$this->senderId}"),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'reader_id' => $this->readerId,
            'read_at' => $this->readAt,
        ];
    }
}
