<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ComplaintSubject extends Model
{
    use HasFactory;

    public $table = 'complaint_subject',
           $fillable = ['complaint_id', 'student_id', 'incident_summary'],
           $timestamps = false;

    public function complaint() {
        return $this->belongsTo(Complaint::class, 'complaint_id', 'id');
    }
    public function violation() {
        return $this->belongsTo(Violation::class, 'offense_id', 'id');
    }
    // ❗ Correct offenses mapping: match BOTH complaint_id AND student_id
    public function offenses()
    {
        return $this->hasMany(ComplaintSubjectViolation::class, 'complaint_id', 'complaint_id')
                    ->whereColumn('student_id', 'student_id');
    }

    public function complaintSubjectOffense() {
        return $this->hasMany(ComplaintSubjectViolation::class, 'complaint_id', 'complaint_id')
                    ->where('student_id', $this->student_id);
    }


    public function user() {
        return $this->belongsTo(User::class, 'student_id', 'id');
    }
}
