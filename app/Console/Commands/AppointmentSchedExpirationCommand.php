<?php

namespace App\Console\Commands;

use App\Models\Appointment;
use Illuminate\Console\Command;

class AppointmentSchedExpirationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:appointment-sched-expiration-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = "Check if the user reaches the date of scheduled appointment and clear the record 2 days after";

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Appointment::where('date_time_appoint', '<', now()->subDays(2))->delete();
    }
}
