<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Faithful pass-through of the TeachingStaff model's existing shape (see
 * ComplaintResource for why this isn't a redesigned contract).
 */
class TeachingStaffResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'program_id' => $this->program_id,
            'position' => $this->position,
            'program' => $this->whenLoaded('program'),
            'user' => $this->whenLoaded('user'),
        ];
    }
}
