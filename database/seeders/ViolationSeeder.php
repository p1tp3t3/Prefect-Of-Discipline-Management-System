<?php

namespace Database\Seeders;

use App\Models\Penalty;
use App\Models\Violation;
use App\Models\ViolationPenalty;
use Illuminate\Database\Seeder;

class ViolationSeeder extends Seeder
{
    /**
     * Real PCZC Student Handbook data (Penalties legend + Minor/Major
     * Offenses tables with their occurrence-based penalty escalation).
     * A handful of cells were smudged/ambiguous in the source photos —
     * see the notes above the affected rows below.
     */
    public function run(): void
    {
        // ---- Penalties (the handbook's numbered "LEGEND") ----
        $penalties = Penalty::factory()->createMany([
            ['ref_number' => 1.00, 'name' => 'Warning', 'description' => 'Warning'],
            ['ref_number' => 1.10, 'name' => 'Oral Warning', 'description' => 'Oral Warning'],
            ['ref_number' => 1.20, 'name' => 'Written Warning', 'description' => 'Written Warning'],
            ['ref_number' => 1.30, 'name' => 'Conference with Parents/Guardians', 'description' => 'Conference with Parents/Guardians'],
            ['ref_number' => 2.00, 'name' => 'Restitution', 'description' => 'Restitution'],
            ['ref_number' => 3.00, 'name' => 'Confiscation', 'description' => 'Confiscation'],
            ['ref_number' => 4.00, 'name' => 'Demerit', 'description' => 'Demerit'],
            ['ref_number' => 5.00, 'name' => 'Suspension', 'description' => 'Suspension'],
            ['ref_number' => 5.10, 'name' => 'Suspension (1 Day) with Community Service', 'description' => 'One (1) Day Suspension with Community Service'],
            ['ref_number' => 5.20, 'name' => 'Suspension (2 Days) with Community Service', 'description' => 'Two (2) Days Suspension with Community Service'],
            ['ref_number' => 5.30, 'name' => 'Suspension (3 Days) with Community Service', 'description' => 'Three (3) Days Suspension with Community Service'],
            ['ref_number' => 5.40, 'name' => 'Suspension (4 Days) with Community Service', 'description' => 'Four (4) Days Suspension with Community Service'],
            ['ref_number' => 5.50, 'name' => 'Suspension (5 Days) with Community Service', 'description' => 'Five (5) Days Suspension with Community Service'],
            ['ref_number' => 6.00, 'name' => 'Exclusion', 'description' => 'Exclusion'],
            ['ref_number' => 7.00, 'name' => 'Dismissal/Non-readmission', 'description' => 'Dismissal/Non-readmission'],
            ['ref_number' => 8.00, 'name' => 'Expulsion', 'description' => 'Expulsion'],
        ]);

        // Built manually (not via ->pluck('id', 'ref_number')) because PHP
        // silently truncates float array keys to integers, which would
        // collapse 1.00/1.10/1.20/1.30 (and every other *.x0 group) onto
        // the same key.
        $penaltyIdsByRef = [];
        foreach ($penalties as $penalty) {
            $penaltyIdsByRef[number_format((float) $penalty->ref_number, 2)] = $penalty->id;
        }

        // Minor Offenses table. `ladder` maps occurrence (1-6) to one or
        // more penalty ref_numbers — some rows stack a second penalty
        // (e.g. Confiscation) on top of the suspension for later occurrences.
        $minor = [
            ['name' => 'Unexcused Tardiness or Absence', 'ladder' => [1 => [1.10], 2 => [1.20], 3 => [5.10], 4 => [5.30], 5 => [5.30], 6 => [5.40]]],
            ['name' => 'Wearing Of Improper And Incomplete Uniforms', 'ladder' => [1 => [1.10], 2 => [1.20], 3 => [5.10], 4 => [5.30], 5 => [5.30], 6 => [5.40]]],
            ['name' => 'Wearing Of Improper And Other Colored Hijab', 'ladder' => [1 => [1.10], 2 => [1.20], 3 => [5.10], 4 => [5.30], 5 => [5.30], 6 => [5.40]]],
            ['name' => 'Staying in a Prohibited Area', 'ladder' => [1 => [1.10], 2 => [1.20], 3 => [5.10], 4 => [5.30], 5 => [5.30], 6 => [5.40]]],
            ['name' => 'Wearing Of Accessories Earrings For Males Dangling Or Multiple Pairs For Females', 'ladder' => [1 => [1.10], 2 => [1.20], 3 => [5.10], 4 => [5.20, 3.00], 5 => [5.30, 3.00], 6 => [5.40, 3.00]]],
            ['name' => 'Wearing Of Heavy Makeup Or Decorative Contact Lenses', 'ladder' => [1 => [1.10], 2 => [1.20], 3 => [5.10], 4 => [5.30], 5 => [5.30], 6 => [5.40]]],
            ['name' => 'Wearing Of Scarves Patches Caps Bonnets', 'ladder' => [1 => [1.10], 2 => [1.20], 3 => [5.10], 4 => [5.20, 3.00], 5 => [5.30, 3.00], 6 => [5.40, 3.00]]],
            ['name' => 'Wearing And Using Electronic Headset Earbuds or Gadgets Without Permission', 'ladder' => [1 => [1.10], 2 => [1.20], 3 => [5.10], 4 => [5.20, 3.00], 5 => [5.30, 3.00], 6 => [5.40, 3.00]]],
            ['name' => 'Wearing Of School Uniform Program Shirt In Public Places Unrelated To School Activity', 'ladder' => [1 => [1.10], 2 => [1.20], 3 => [5.10], 4 => [5.20], 5 => [5.30], 6 => [5.40]]],
            ['name' => 'Colored Nail Polish', 'ladder' => [1 => [1.10], 2 => [1.20], 3 => [5.10], 4 => [5.20], 5 => [5.30], 6 => [5.40]]],
            ['name' => 'Colored Or Dyed Hair Beard', 'ladder' => [1 => [1.10], 2 => [1.20], 3 => [5.10], 4 => [5.20], 5 => [5.30], 6 => [5.40]]],
            ['name' => 'Not Following Prescribed Haircut', 'ladder' => [1 => [1.10], 2 => [1.20], 3 => [5.10], 4 => [5.20], 5 => [5.30], 6 => [5.40]]],
            // Handbook lists occurrence 6 for this one as "minor to major"
            // (a reclassification, not a penalty) — no 6th-occurrence row here.
            ['name' => 'Not Attending School Functions', 'ladder' => [1 => [1.20], 2 => [5.10], 3 => [5.20], 4 => [5.30], 5 => [5.40]]],
            ['name' => 'Shouting Laughing Boisterously Making Noise', 'ladder' => [1 => [1.10], 2 => [1.20], 3 => [5.10], 4 => [5.20], 5 => [5.30], 6 => [5.40]]],
            ['name' => 'Littering In Campus', 'ladder' => [1 => [1.10], 2 => [1.20], 3 => [5.10], 4 => [5.20], 5 => [5.30], 6 => [5.40]]],
            ['name' => 'Bringing Plastic Bottles Or Wrappers In Campus', 'ladder' => [1 => [1.10], 2 => [1.20], 3 => [5.10, 3.00], 4 => [5.20, 3.00], 5 => [5.30, 3.00], 6 => [5.40, 3.00]]],
            ['name' => 'Placing Stickers And Other Objects On School ID', 'ladder' => [1 => [1.20], 2 => [5.10], 3 => [5.20], 4 => [5.30], 5 => [5.40]]],
            ['name' => 'Posting Indecent Photos Videos', 'ladder' => [1 => [1.20], 2 => [5.10], 3 => [5.20], 4 => [5.30], 5 => [5.40]]],
            ['name' => 'Public Display Of Affection', 'ladder' => [1 => [1.20], 2 => [5.10], 3 => [5.20], 4 => [5.30], 5 => [5.40]]],
            ['name' => 'Indecency In Oral Language Writing Or Action', 'ladder' => [1 => [1.20], 2 => [5.10], 3 => [5.20], 4 => [5.30], 5 => [5.40]]],
        ];

        // Major Offenses table. Handbook item #21 was not legible in the
        // source photos (cut off between pages) and is intentionally omitted.
        $major = [
            // Rows 1-2 had two overlapping sub-ladders in the source (per
            // target/method) that didn't cleanly separate — normalized to a
            // single, monotonically-escalating ladder.
            ['name' => 'Bullying Cyber Embarrassment Personal', 'ladder' => [1 => [1.30], 2 => [5.10], 3 => [5.20], 4 => [5.30], 5 => [5.40], 6 => [5.50]]],
            ['name' => 'Assaulting Fellow Students', 'ladder' => [1 => [1.30], 2 => [5.10], 3 => [5.20], 4 => [5.30], 5 => [5.40], 6 => [6.00]]],
            ['name' => 'Purchase Sale Of Alcohol Inside Or Outside Campus', 'ladder' => [1 => [5.10], 2 => [5.20], 3 => [5.30], 4 => [5.40], 5 => [5.50], 6 => [6.00]]],
            ['name' => 'Provocation Leading To Confrontation', 'ladder' => [1 => [5.10], 2 => [5.20], 3 => [5.30], 4 => [5.40], 5 => [5.50], 6 => [6.00]]],
            ['name' => 'Prohibited Use of Gadgets', 'ladder' => [1 => [5.10], 2 => [5.20], 3 => [5.30], 4 => [5.40], 5 => [5.50], 6 => [6.00]]],
            ['name' => 'Posting Uploading Destructive Language Online', 'ladder' => [1 => [5.10], 2 => [5.20], 3 => [5.30], 4 => [5.40], 5 => [5.50], 6 => [6.00]]],
            ['name' => 'Unbecoming Attitude Endangering Others', 'ladder' => [1 => [1.30], 2 => [5.10], 3 => [5.20], 4 => [5.30], 5 => [5.40], 6 => [6.00]]],
            ['name' => 'Altering Information Or Unauthorized Access', 'ladder' => [1 => [5.30], 2 => [5.40], 3 => [5.50], 4 => [6.00], 5 => [7.00]]],
            ['name' => 'Bringing Outsiders During School Function', 'ladder' => [1 => [5.30], 2 => [5.50], 3 => [6.00], 4 => [7.00]]],
            ['name' => 'Bringing Outsiders For Fighting', 'ladder' => [1 => [5.30], 2 => [5.50], 3 => [6.00], 4 => [7.00]]],
            ['name' => 'Circulating Destructive Language In Social Media', 'ladder' => [1 => [5.30], 2 => [5.50], 3 => [6.00], 4 => [7.00]]],
            ['name' => 'Cheating In Examinations Plagiarism', 'ladder' => [1 => [5.30, 4.00], 2 => [5.40, 4.00], 3 => [5.50, 4.00], 4 => [6.00], 5 => [7.00]]],
            ['name' => 'Cybercrime Computer Security Breach', 'ladder' => [1 => [5.30], 2 => [5.40], 3 => [5.50], 4 => [6.00], 5 => [7.00]]],
            // Source showed "3.4"/"3.5" here, which aren't valid penalty
            // codes anywhere in the legend — read as "5.4"/"5.5" to match
            // the identical pattern in every neighboring row.
            ['name' => 'Damaging Destroying Information', 'ladder' => [1 => [5.30], 2 => [5.40], 3 => [5.50], 4 => [6.00], 5 => [7.00]]],
            ['name' => 'Dishonesty', 'ladder' => [1 => [5.30], 2 => [5.50], 3 => [6.00], 4 => [7.00]]],
            ['name' => 'Display Possession Or Distribution Of Pornographic Materials', 'ladder' => [1 => [5.30], 2 => [5.50], 3 => [6.00], 4 => [7.00]]],
            ['name' => 'Engaging In Any Form Of Gambling', 'ladder' => [1 => [5.30], 2 => [5.40], 3 => [5.50], 4 => [6.00]]],
            ['name' => 'Falsification Of Official Documents', 'ladder' => [1 => [5.30], 2 => [5.40], 3 => [5.50], 4 => [6.00], 5 => [7.00]]],
            ['name' => 'Inciting Others To Violate School Regulations', 'ladder' => [1 => [5.30], 2 => [5.40], 3 => [6.00]]],
            ['name' => 'Introducing False Information To Avoid Class', 'ladder' => [1 => [5.30], 2 => [5.40], 3 => [5.50], 4 => [6.00], 5 => [7.00]]],
            // Item #21 omitted — illegible in the source photos.
            ['name' => 'Jumping Over The School Fence', 'ladder' => [1 => [5.30], 2 => [5.40], 3 => [5.50], 4 => [6.00], 5 => [7.00]]],
            ['name' => 'Leaving The Classroom Without Permission', 'ladder' => [1 => [5.30], 2 => [5.40], 3 => [5.50], 4 => [6.00], 5 => [7.00]]],
            ['name' => 'Lending Borrowing Or Using Another Persons ID', 'ladder' => [1 => [5.30], 2 => [5.40], 3 => [5.50], 4 => [6.00], 5 => [7.00]]],
            ['name' => 'Preventing Authorized Use Of School Facilities', 'ladder' => [1 => [5.30], 2 => [5.40], 3 => [5.50], 4 => [6.00], 5 => [7.00]]],
            ['name' => 'Preventing Normal Operation Of Systems', 'ladder' => [1 => [5.30], 2 => [5.40], 3 => [5.50], 4 => [6.00], 5 => [7.00]]],
            // Source showed "3.5" here — read as "5.5", same correction as above.
            ['name' => 'Repeated Use Of Profane Or Indecent Language', 'ladder' => [1 => [5.30], 2 => [5.40], 3 => [5.50], 4 => [6.00], 5 => [7.00]]],
            ['name' => 'Shoplifting', 'ladder' => [1 => [5.30], 2 => [5.40], 3 => [5.50], 4 => [6.00], 5 => [7.00]]],
            ['name' => 'Smoking Vaping Or Possession Of Cigarettes', 'ladder' => [1 => [5.30], 2 => [5.40], 3 => [5.50], 4 => [6.00], 5 => [7.00]]],
            ['name' => 'Stealing Property Of School Or Students', 'ladder' => [1 => [5.30, 2.00], 2 => [5.50, 2.00], 3 => [6.00], 4 => [7.00]]],
            ['name' => 'Tampering With School ID Or Records', 'ladder' => [1 => [5.30], 2 => [5.40], 3 => [5.50], 4 => [6.00], 5 => [7.00]]],
            ['name' => 'Unjust Enrichment Or Theft', 'ladder' => [1 => [5.30], 2 => [5.50], 3 => [6.00], 4 => [7.00]]],
            ['name' => 'Vandalism Or Destruction Of School Property', 'ladder' => [1 => [5.30, 2.00], 2 => [5.40, 2.00], 3 => [5.50, 2.00], 4 => [6.00], 5 => [7.00]]],
            ['name' => 'Viewing Pornographic Sites In Computer Laboratory', 'ladder' => [1 => [5.30], 2 => [5.50], 3 => [6.00], 4 => [7.00]]],
            ['name' => 'Wearing Indecent Clothing', 'ladder' => [1 => [5.30], 2 => [5.40], 3 => [5.50], 4 => [6.00], 5 => [7.00]]],
            ['name' => 'Willful Damage Of School Property', 'ladder' => [1 => [5.30], 2 => [5.40], 3 => [5.50], 4 => [6.00], 5 => [7.00]]],
            ['name' => 'Failure To Comply With Investigation Summons', 'ladder' => [1 => [5.30], 2 => [5.40], 3 => [5.50], 4 => [6.00], 5 => [7.00]]],
            ['name' => 'Trouble Outside School Related To School Matters', 'ladder' => [1 => [5.40], 2 => [5.50], 3 => [6.00]]],
            ['name' => 'Forging Signatures Of Authorities Or Parents', 'ladder' => [1 => [5.40], 2 => [6.00], 3 => [7.00]]],
            ['name' => 'Bringing Dishonor To The School', 'ladder' => [1 => [5.50], 2 => [6.00]]],
            ['name' => 'Gross Acts Of Disobedience', 'ladder' => [1 => [5.50], 2 => [6.00], 3 => [7.00]]],
            ['name' => 'Extortion Blackmailing Ridicule Or Contempt', 'ladder' => [1 => [5.50], 2 => [6.00], 3 => [7.00]]],
            ['name' => 'Insubordination To Authorities', 'ladder' => [1 => [5.50], 2 => [6.00], 3 => [7.00]]],
            ['name' => 'Slander Or Oral Defamation', 'ladder' => [1 => [5.50], 2 => [6.00], 3 => [7.00]]],
            ['name' => 'Invasion Of Privacy', 'ladder' => [1 => [5.50], 2 => [6.00], 3 => [7.00]]],
            ['name' => 'Breach Of Confidentiality', 'ladder' => [1 => [5.50], 2 => [6.00], 3 => [7.00]]],
            ['name' => 'Organizing Groups To Damage School Property', 'ladder' => [1 => [5.50], 2 => [6.00], 3 => [7.00]]],
            ['name' => 'Repeated Offense', 'ladder' => [1 => [5.50], 2 => [6.00], 3 => [7.00]]],
            ['name' => 'Premarital Sex', 'ladder' => [1 => [6.00], 2 => [7.00]]],
            ['name' => 'Immoral Or Indecent Conduct', 'ladder' => [1 => [6.00], 2 => [7.00], 3 => [8.00]]],
            ['name' => 'Presence In Providing Financing Venues For Sororities', 'ladder' => [1 => [6.00], 2 => [7.00]]],
            ['name' => 'Promoting Or Participating In Immoral Indecent Conduct', 'ladder' => [1 => [6.00], 2 => [7.00], 3 => [8.00]]],
            ['name' => 'Recruitment Membership In Illegal Fraternities', 'ladder' => [1 => [6.00], 2 => [7.00]]],
            ['name' => 'Pushing Or Distributing Drugs', 'ladder' => [1 => [6.00], 2 => [7.00], 3 => [8.00]]],
            ['name' => 'Conviction For Criminal Offense', 'ladder' => [1 => [7.00]]],
            ['name' => 'Direct Assault On Administration Faculty Or Staff', 'ladder' => [1 => [7.00]]],
            ['name' => 'Membership In Sororities Or Fraternities', 'ladder' => [1 => [7.00]]],
            ['name' => 'Possession Or Use Of Deadly Weapons Or Drugs', 'ladder' => [1 => [7.00]]],
            ['name' => 'Grave Threat Against Student Or Faculty', 'ladder' => [1 => [7.00]]],
            ['name' => 'Using Another Persons Identity', 'ladder' => [1 => [7.00]]],
            ['name' => 'Consistent Violation Of School Rules', 'ladder' => [1 => [7.00]]],
        ];

        $violationLinks = [];

        foreach ([[$minor, false], [$major, true]] as [$list, $offenseStatus]) {
            foreach ($list as $entry) {
                $violation = Violation::factory()->create([
                    'violation_name' => $entry['name'],
                    'offense_status' => $offenseStatus,
                ]);

                foreach ($entry['ladder'] as $occurrence => $refs) {
                    foreach ($refs as $ref) {
                        $violationLinks[] = [
                            'violation_id' => $violation->id,
                            'occurrence' => $occurrence,
                            'penalty_id' => $penaltyIdsByRef[number_format($ref, 2)],
                        ];
                    }
                }
            }
        }

        ViolationPenalty::factory()->createMany($violationLinks);
    }
}
