<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdmisionReason extends Model
{
    public $table = 'admission_reason',
           $fillable = ['admission_id', 'reason'],
           $timestamps = false;
    
    public function admission() {
        return $this->belongsTo(Admission::class, 'admission_id', 'id');
    }
}
