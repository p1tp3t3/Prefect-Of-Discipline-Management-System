<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CsvImportRowResult extends Model
{
    public $table = 'csv_import_row_results',
           $timestamps = false;

    public $fillable = [
        'batch_id',
        'row_index',
        'id_number',
        'full_name',
        'status',
        'message',
        'export_data',
    ];

    protected $casts = [
        'export_data' => 'array',
    ];
}
