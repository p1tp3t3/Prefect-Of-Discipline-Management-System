<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Faithful pass-through of the GatePass model's existing shape (see
 * ComplaintResource for why this isn't a redesigned contract).
 */
class GatePassResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'reason' => $this->reason,
            'allow_to' => $this->allow_to,
            'confirmed_at' => $this->confirmed_at,
            'date_expiration' => $this->date_expiration,
            'created_at' => $this->created_at,
            'user' => $this->whenLoaded('user'),
        ];
    }
}
