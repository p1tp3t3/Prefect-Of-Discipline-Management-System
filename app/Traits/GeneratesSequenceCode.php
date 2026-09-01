<?php

namespace App\Traits;

trait GeneratesSequenceCode
{
    /**
     * Builds a "{MMDDYY}{2-digit daily sequence}" code, e.g. "08292601".
     */
    protected function generateSequenceCode(string $modelClass, string $column): string
    {
        $prefix = now()->format('mdy');

        // Count against the code column itself (not created_at) — the DB's
        // useCurrent() timestamp default runs in the DB server's own timezone,
        // which may not match the app's, so comparing dates against it is unsafe.
        $count = $modelClass::where($column, 'like', "{$prefix}%")->count() + 1;

        return $prefix . str_pad($count, 2, '0', STR_PAD_LEFT);
    }
}
