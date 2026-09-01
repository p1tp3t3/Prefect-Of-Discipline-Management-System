<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComplaintEvidenceFile extends Model
{
    public $table = 'complaint_evidence_file',
           $fillable = ['complaint_case_number', 'evidence_file', 'file_type'];
    public $timestamps = false;
    public function complaint() {
        return $this->belongsTo(Complaint::class, 'case_number', 'complaint_case_number');
    }
}
