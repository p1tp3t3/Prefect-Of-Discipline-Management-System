<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ViolationRiskMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public $data;
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Violation Risk Mail',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'email.repeat-violation-risk-mail',
            with: [
                'program_name' => $this->data['program_name'],
                'student_name' => $this->data['student_name'],
                'student_id' => $this->data['student_id'],
                'profile_picture' => $this->data['profile_picture'],
                'year_level' => $this->data['year_level'],
                'violation_count' => $this->data['violation_count'],
                'repeat_violation_count' => $this->data['repeat_violation_count'],
                'percentage' => $this->data['percentage'],
                'message' => $this->data['message']
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
