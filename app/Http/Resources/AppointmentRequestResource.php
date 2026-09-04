<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Faithful pass-through of the AppointmentRequest model's existing shape
 * (see ComplaintResource for why this isn't a redesigned contract).
 */
class AppointmentRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'appointment_id' => $this->appointment_id,
            'request_type' => $this->request_type,
            'date_time_appoint' => $this->date_time_appoint,
            'description' => $this->description,
            'confirmed' => $this->confirmed,
            'created_at' => $this->created_at,
            'user' => $this->whenLoaded('user'),
            'appointment' => $this->whenLoaded('appointment'),
        ];
    }
}
