<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GatePassReason extends Model
{
    public $table = 'gate_pass_reason',
           $fillable = ['gatepass_id', 'reason'],
           $timestamps = false;

    public function gatepass() {
        return $this->belongsTo(GatePass::class, 'gatepass_id', 'id');
    }
}
