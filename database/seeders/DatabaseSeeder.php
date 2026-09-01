<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        self::refresh_storage();
        self::call([
            AdminSeeder::class,
            ProgramSeeder::class,
            ViolationSeeder::class,
            StudentSeeder::class,
            TeachingStaffSeeder::class,
            ComplaintSeeder::class,
            ReferralSeeder::class,
            AbsenceSeeder::class,
        ]);
        $this->command->info('Database seeded successfully.');
    }
    private function refresh_storage() {
        $private_folders = [
            storage_path('app/private/complaints'),
            storage_path('app/private/user-profile'),
            storage_path('app/private/absent-forms'),
            storage_path('app/private/referrals'),
        ];

        $this->command->info('Refreshing storage folders...');
        File::deleteDirectories($private_folders);
        foreach ($private_folders as $folder) {
            if (!File::isDirectory($folder)) {
                File::makeDirectory($folder, 0755, true);
            }
        }
        $this->command->info('Storage folders refreshed successfully.');
    }
}
