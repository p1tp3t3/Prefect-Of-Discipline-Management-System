<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Parents extends Model
{
    /** @use HasFactory<\Database\Factories\ParentFactory> */
    use HasFactory;

    public $timestamps = false;
    public $table = 'parent', 
           $fillable = ['user_id', 'parent_role', 'work_occupation'];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
