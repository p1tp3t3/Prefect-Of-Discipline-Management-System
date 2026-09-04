<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class AvailabilityCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:availability-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check if Prefect is Available';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        send_web_push([
            'title' => 'Hello Users',
            'body' => 'The Prefect Is Now Available For Transactions',
            'icon' => '',
            'url' => '/dashboard'
        ], null);
        $this->info('available');
    }
}
