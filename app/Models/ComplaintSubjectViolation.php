<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ComplaintSubjectViolation extends Model
{
    use HasFactory;

    public $table = 'complaint_subject_violation',
           $fillable = ['complaint_id', 'student_id', 'violation_id'],
           $timestamps = false;

    public function complaint() {
        return $this->belongsTo(Complaint::class, 'complaint_id', 'id');
    }
    public function violation() {
        return $this->belongsTo(Violation::class, 'violation_id', 'id');
    }
    public function user() {
        return $this->belongsTo(User::class, 'student_id', 'id');
    }
}
