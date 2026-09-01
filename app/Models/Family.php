<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Family extends Model
{
    /** @use HasFactory<\Database\Factories\FamilyFactory> */
    use HasFactory;

    public $table = 'family', 
           $fillable = ['family_name'],
           $timestamps = false;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->family_code = self::generateFamilyID();
        });
    }

    public function familyMember() {
        return $this->hasMany(FamilyMember::class, 'family_id', 'id');
    }
    public static function generateFamilyID()
    {
        $prefix = "FID";
        $year = date('Y');

        // get latest family ID
        $latest = self::orderBy('family_code', 'desc')->value('family_code'); 
        // ex: "FID202405"

        if (!$latest) {
            // start with 01 if no records
            $increment = "01";
        } else {
            // extract last 2 digits
            $lastIncrement = intval(substr($latest, -2));
            $newIncrement = $lastIncrement + 1;

            // always format to 2 digits
            $increment = str_pad($newIncrement, 2, "0", STR_PAD_LEFT);
        }

        return $prefix . $year . $increment;
    }
}
