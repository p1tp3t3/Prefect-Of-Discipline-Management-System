<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReportGenerated implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    private $userId;
    private $data;

    public function __construct($userId, array $data)
    {
        $this->userId = $userId;
        $this->data = $data;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("job-status.progress.user.{$this->userId}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'ReportGenerated';
    }

    public function broadcastWith(): array
    {
        return $this->data;
    }
}
