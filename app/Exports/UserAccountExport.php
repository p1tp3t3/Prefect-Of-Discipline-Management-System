<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;

class UserAccountExport implements FromArray
{
    protected $array;

    public function __construct(array $array)
    {
        $this->array = $array;
    }

    public function array(): array
    {
        return $this->array;
    }
}
