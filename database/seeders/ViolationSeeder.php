<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ViolationSeeder extends Seeder
{
    public function run(): void
    {
        $minor = [
            'Did not wear the correct school uniform',
            'Used a mobile phone during class',
            'Skipped class without valid reason',
            'Left school premises without a gate pass',
            'Entered faculty room without permission',
            'Disrespected a teacher in class',
            'Littering within school premises',
            'Public display of affection',
            'Loitering during class hours',
            'Improper use of school ID',
        ];

        $major = [
            'Engaged in a physical altercation with a classmate',
            'Brought alcohol to campus',
            'Brought a bladed weapon to school',
            'Falsified an excuse letter or school document',
            'Cheating during an examination',
            'Bullying or harassment of another student',
            'Vandalism of school property',
            'Possession of prohibited substances',
            'Theft of school or personal property',
            'Posted offensive content about a teacher or student online',
        ];

        foreach ($minor as $name) {
            DB::table('violation')->updateOrInsert(
                ['violation_name' => $name],
                ['offense_status' => false, 'created_at' => now()]
            );
        }

        foreach ($major as $name) {
            DB::table('violation')->updateOrInsert(
                ['violation_name' => $name],
                ['offense_status' => true, 'created_at' => now()]
            );
        }
    }
}
