<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class GatePassMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    private $requester, $date_requested, $date_time_expiration, $prefect_name, $status;

    public function __construct($data)
    {
        $this->requester = $data['requester'];
        $this->date_requested = $data['date_requested'];
        $this->status = $data['status'];
        $this->date_time_expiration = $data['date_time_expiration'];
        $this->prefect_name = $data['prefect_name'];
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Gate Pass Mail',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.gatepass-email',
            with: [
                'requester' => $this->requester,
                'date_requested' => $this->date_requested,
                'status' => $this->status,
                'date_time_expiration' => $this->date_time_expiration,
                'prefect_name' => $this->prefect_name
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
