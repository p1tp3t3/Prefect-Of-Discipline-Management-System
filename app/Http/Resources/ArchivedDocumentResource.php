<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * ArchiveController::getDocuments() merges Complaint/Referral/Absence
 * records (each already reshaped with ad-hoc usr/student/students/type
 * properties) into one heterogeneous list. The three source shapes differ
 * enough that a single enumerated field whitelist would need per-type
 * branching, with real risk of silently dropping something the frontend
 * still reads — so this stays a pass-through of that already-reshaped
 * output rather than a fresh per-field contract.
 */
class ArchivedDocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return $this->resource->toArray();
    }
}
