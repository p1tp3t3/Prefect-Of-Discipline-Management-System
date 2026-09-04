<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ViolationPenalty extends Model
{
    use HasFactory;

    public $fillable = ['violation_id', 'occurrence', 'penalty_id'],
           $table = 'violation_penalty';
    public $timestamps = false;

    public function violation() {
        return $this->belongsTo(Violation::class, 'violation_id', 'id');
    }
    public function penalty() {
        return $this->belongsTo(Penalty::class, 'penalty_id', 'id');
    }

}
