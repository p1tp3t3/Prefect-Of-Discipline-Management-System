<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FamilyMember extends Model
{
    /** @use HasFactory<\Database\Factories\FamilyMemberFactory> */
    use HasFactory;

    public $table = 'family_member',
           $fillable = ['family_id', 'member_id'],
           $timestamps = false;

    public function family() {
        return $this->belongsTo(Family::class, 'family_id', 'id');
    }
    public function member() {
        return $this->belongsTo(User::class, 'member_id', 'id');
    }
}
