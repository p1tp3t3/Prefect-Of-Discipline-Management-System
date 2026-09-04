<?php

namespace Database\Seeders;

use App\Models\Penalty;
use App\Models\Violation;
use App\Models\ViolationPenalty;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

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

        $minorViolations = Violation::factory()->createMany(
            collect($minor)->map(fn ($name) => [
                'violation_name' => $name,
                'offense_status' => false,
            ])
        );

        $majorViolations = Violation::factory()->createMany(
            collect($major)->map(fn ($name) => [
                'violation_name' => $name,
                'offense_status' => true,
            ])
        );

        // ---- Penalties ----
        // ref_number is just a display sequence, not the occurrence — the
        // occurrence-specific escalation ladder is expressed separately below,
        // via violation_penalty.
        $penalties = Penalty::factory()->createMany([
            ['ref_number' => 1.00, 'name' => 'Verbal Warning', 'description' => 'Verbal Warning'],
            ['ref_number' => 2.00, 'name' => 'Written Warning', 'description' => 'Written Warning'],
            ['ref_number' => 3.00, 'name' => 'Parent Conference', 'description' => 'Parent/Guardian Conference'],
            ['ref_number' => 4.00, 'name' => 'Community Service', 'description' => 'Community Service (4 Hours)'],
            ['ref_number' => 5.00, 'name' => 'Suspension (3 Days)', 'description' => 'Suspension for 3 Days'],
            ['ref_number' => 6.00, 'name' => 'Suspension (1 Week)', 'description' => 'Suspension for 1 Week'],
            ['ref_number' => 7.00, 'name' => 'Suspension (2 Weeks)', 'description' => 'Suspension for 2 Weeks'],
            ['ref_number' => 8.00, 'name' => 'Expulsion Recommendation', 'description' => 'Recommendation for Expulsion'],
        ]);

        $penaltyIdsByDescription = $penalties->pluck('id', 'description');

        // ---- Violation <-> Penalty escalation ladder (occurrence 1-6) ----
        // Major offenses escalate to the most severe penalties faster than
        // minor ones do, mirroring how ManageViolation/OffenseList group
        // penalties by occurrence on the frontend. From the 3rd occurrence
        // onward, penalties stack (an occurrence can carry 2+ penalties) —
        // e.g. a suspension still comes with a parent conference.
        $minorLadder = [
            1 => ['Verbal Warning'],
            2 => ['Written Warning'],
            3 => ['Written Warning', 'Parent/Guardian Conference'],
            4 => ['Parent/Guardian Conference', 'Community Service (4 Hours)'],
            5 => ['Community Service (4 Hours)', 'Suspension for 3 Days'],
            6 => ['Suspension for 3 Days', 'Suspension for 1 Week'],
        ];

        $majorLadder = [
            1 => ['Written Warning'],
            2 => ['Parent/Guardian Conference'],
            3 => ['Parent/Guardian Conference', 'Suspension for 3 Days'],
            4 => ['Suspension for 3 Days', 'Suspension for 1 Week'],
            5 => ['Suspension for 1 Week', 'Suspension for 2 Weeks'],
            6 => ['Suspension for 2 Weeks', 'Recommendation for Expulsion'],
        ];
        
        $linksFor = fn (Collection $violations, array $ladder) => $violations->flatMap(
            fn (Violation $violation) => collect($ladder)->flatMap(
                fn ($descriptions, $occurrence) => collect($descriptions)->map(fn ($description) => [
                    'violation_id' => $violation->id,
                    'occurrence' => $occurrence,
                    'penalty_id' => $penaltyIdsByDescription[$description],
                ])
            )
        );

        ViolationPenalty::factory()->createMany(
            $linksFor($minorViolations, $minorLadder)
                ->merge($linksFor($majorViolations, $majorLadder))
        );
    }
}
