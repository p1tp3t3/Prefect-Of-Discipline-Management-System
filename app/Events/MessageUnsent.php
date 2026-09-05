<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageUnsent implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public $queue = 'notification';

    public function __construct(private int $receiverId, private int $messageId)
    {
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("chat.{$this->receiverId}"),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'message_id' => $this->messageId,
        ];
    }
}
