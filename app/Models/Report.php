<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    public $fillable = ['report_name', 'report_type', 'date_from', 'date_to', 'file_type', 'description'],
           $table = 'report',
           $timestamps = false;
}
