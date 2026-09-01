<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ViolationPenalty extends Model
{
    public $fillable = ['violation_id', 'occurence', 'penalty_id'],
           $table = 'violation_penalty';

    public function violation() {
        return $this->belongsTo(Violation::class, 'violation_id', 'id');
    }
    public function penalty() {
        return $this->belongsTo(Penalty::class, 'penalty_id', 'id');
    }

}
