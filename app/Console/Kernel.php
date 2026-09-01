<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        // Schedule your command here
        $schedule->command('app:availability-command')->everyMinute();
    }

    protected function commands(): void
    {
        // Auto-load commands
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}
